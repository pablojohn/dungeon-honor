import React, { useState } from "react";
import {
  Sword,
  Shield,
  Heart,
  ShieldPlus,
  MessageSquareMore,
  HeartPulse,
  CheckCircle,
} from "lucide-react";
import DualButton from "../shared/dual-button";

interface CardProps {
  name: string;
  realm: string;
  role: string;
  slug: string;
}

const saveBehaviorToUpstash = async (slug: string, behavior: string) => {
  try {
    const response = await fetch("/api/behaviors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, behavior }),
    });

    if (!response.ok) {
      throw new Error("Failed to save behavior");
    }
    console.log("Behavior saved successfully");
  } catch (error) {
    console.error(error);
  }
};

const saveRejoinRating = async (slug: string, rating: boolean) => {
  const payload = { slug, rating: rating.toString() };

  try {
    const response = await fetch("/api/rejoinRatings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save rejoin rating");
    }

    console.log("Rejoin Rating saved successfully");
  } catch (error) {
    console.error("Error in saveRejoinRating:", error);
  }
};

export const RunDetailCard: React.FC<CardProps> = ({ name, realm, role, slug }) => {
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [showRejoinQuestion, setShowRejoinQuestion] = useState(false);
  const [selectedRejoinRating, setSelectedRejoinRating] = useState<boolean | null>(null);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const handleBehaviorClick = (behavior: string) => {
    if (!selectedBehaviors.includes(behavior)) {
      setSelectedBehaviors([...selectedBehaviors, behavior]);
      saveBehaviorToUpstash(slug, behavior);
    }
    setShowRejoinQuestion(true);
    setShowThankYouMessage(false);
    setSelectedRejoinRating(null);
  };

  const handleRejoinRating = (rating: boolean) => {
    saveRejoinRating(slug, rating);
    setSelectedRejoinRating(rating);
    setShowThankYouMessage(true);
    setShowRejoinQuestion(false);
  };

  const renderRoleIcon = () => {
    switch (role.toLowerCase()) {
      case "dps":
        return <Sword className="w-5 h-5 text-red-500" />;
      case "tank":
        return <Shield className="w-5 h-5 text-blue-500" />;
      case "healer":
        return <Heart className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg text-white">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-blue-400">{name}</h2>
        <p className="text-sm text-gray-300">{realm}</p>
        <p className="mt-2 flex justify-center">{renderRoleIcon()}</p>
      </div>

      {/* Updated Container for Buttons */}
      <div className="grid grid-cols-2 gap-4 justify-center mt-6">
        <DualButton
          title={"Big Dam"}
          icon={<Sword className="w-5 h-5 mr-2" />}
          color="red"
          onPlusClick={() => handleBehaviorClick("Big Dam:1")}
          onMinusClick={() => handleBehaviorClick("Big Dam:-1")}
        />
        <DualButton
          title="Uses Defensives"
          icon={<ShieldPlus className="w-5 h-5 mr-2" />}
          color="blue"
          onPlusClick={() => handleBehaviorClick("Uses Defensives:1")}
          onMinusClick={() => handleBehaviorClick("Uses Defensives:-1")}
        />
        <DualButton
          title="Good Comms"
          icon={<MessageSquareMore className="w-5 h-5 mr-2" />}
          color="yellow"
          onPlusClick={() => handleBehaviorClick("Good Comms:1")}
          onMinusClick={() => handleBehaviorClick("Good Comms:-1")}
        />
        <DualButton
          title="Giga Heals"
          icon={<HeartPulse className="w-5 h-5 mr-2" />}
          color="green"
          onPlusClick={() => handleBehaviorClick("Giga Heals:1")}
          onMinusClick={() => handleBehaviorClick("Giga Heals:-1")}
        />
      </div>

      {/* Remaining Components */}
      {selectedBehaviors.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-300">
            {selectedBehaviors.join(", ")} {selectedBehaviors.length > 1 ? "were" : "was"} recorded!
          </p>
        </div>
      )}

      {showRejoinQuestion && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-300">Would you group with them again?</p>
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={() => handleRejoinRating(true)}
              className={`px-4 py-2 rounded-lg border transition ${selectedRejoinRating === true ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleRejoinRating(false)}
              className={`px-4 py-2 rounded-lg border transition ${selectedRejoinRating === false ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              No
            </button>
          </div>
        </div>
      )}

      {showThankYouMessage && (
        <div className="mt-6 text-center flex items-center justify-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span className="font-semibold text-lg">Thank you! Rejoin rating submitted.</span>
        </div>
      )}
    </div>
  );
};
