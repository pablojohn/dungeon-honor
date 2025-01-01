import React, { useState } from "react";
import { Sword, Shield, Heart, ShieldPlus, MessageSquareMore, HeartPulse, CheckCircle } from "lucide-react";
import DualButton from "../shared/dual-button";

interface CardProps {
  name: string;
  realm: string;
  role: string;
  slug: string; // Unique identifier for the run
}

const saveBehaviorToUpstash = async (slug: string, behavior: string) => {
  try {
    const response = await fetch("/api/saveBehavior", {
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
    const response = await fetch("/api/saveRejoinRating", {
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

  const handleRejoinRating = (rating: boolean) => {
    saveRejoinRating(slug, rating);
    setSelectedRejoinRating(rating);
    setShowThankYouMessage(true); // Show the "Thank you" message only after submitting rating
    setShowRejoinQuestion(false); // Optionally hide the rejoin question after rating is submitted
  };

  // Handle adding behavior to selectedBehaviors
  const handleBehaviorClick = (behavior: string) => {
    // Add behavior to the list without removing anything
    if (!selectedBehaviors.includes(behavior)) {
      setSelectedBehaviors([...selectedBehaviors, behavior]);
      saveBehaviorToUpstash(slug, behavior);
    }
    setShowRejoinQuestion(true);
    setShowThankYouMessage(false);
    setSelectedRejoinRating(null);
  };

  // Function to replace :1 with +1 and :-1 with -1, and apply color formatting
  const formatBehaviors = (behaviors: string[]) => {
    return behaviors.map((behavior, index) => {
      // Replace :1 with +1 and :-1 with -1
      const formattedBehavior = behavior.replace(/:1/g, ' +1').replace(/:-1/g, ' -1');

      // Apply darker color formatting for +1 and -1
      if (formattedBehavior.includes('+1')) {
        return (
          <span key={index} className="text-green-700 font-semibold">
            {formattedBehavior}
          </span>
        );
      } else if (formattedBehavior.includes('-1')) {
        return (
          <span key={index} className="text-red-700 font-semibold">
            {formattedBehavior}
          </span>
        );
      }
      return formattedBehavior; // For other behaviors without +1 or -1
    });
  };

  const renderRoleIcon = () => {
    switch (role.toLowerCase()) {
      case "dps":
        return <Sword className="w-5 h-5 text-red-500 inline-block ml-2" />;
      case "tank":
        return <Shield className="w-5 h-5 text-blue-500 inline-block ml-2" />;
      case "healer":
        return <Heart className="w-5 h-5 text-green-500 inline-block ml-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">
          {name}
        </h2>
        <p className="text-sm text-gray-600">
          {realm}
        </p>
        <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
          {renderRoleIcon()}
        </p>
      </div>
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {/* Use DualButton with specific behavior */}
        <DualButton title={"Big Dam"} icon={<Sword className="w-5 h-5 mr-2" />} color="red" onPlusClick={() => handleBehaviorClick("Big Dam:1")} onMinusClick={() => handleBehaviorClick("Big Dam:-1")} />
        <DualButton title="Uses Defensives" icon={<ShieldPlus className="w-5 h-5 mr-2" />} color="blue" onPlusClick={() => handleBehaviorClick("Uses Defensives:1")} onMinusClick={() => handleBehaviorClick("Uses Defensives:-1")} />
        <DualButton title="Good Comms" icon={<MessageSquareMore className="w-5 h-5 mr-2" />} color="yellow" onPlusClick={() => handleBehaviorClick("Good Comms:1")} onMinusClick={() => handleBehaviorClick("Good Comms:-1")} />
        <DualButton title="Giga Heals" icon={<HeartPulse className="w-5 h-5 mr-2" />} color="green" onPlusClick={() => handleBehaviorClick("Giga Heals:1")} onMinusClick={() => handleBehaviorClick("Giga Heals:-1")} />
      </div>
      {selectedBehaviors.length > 0 && (
        <div className="mt-4 text-center text-lg text-gray-900 flex items-center justify-center gap-2">
          <span className="font-semibold">
            <span className="text-gray-900">
              {/* Format and display the selected behaviors with colors */}
              {formatBehaviors(selectedBehaviors).map((behavior, index) => (
                <React.Fragment key={index}>
                  {index > 0 && ', '}
                  {behavior}
                </React.Fragment>
              ))}
            </span>
            {selectedBehaviors.length > 1 ? " were" : " was"} recorded!
          </span>
        </div>
      )}
      {showRejoinQuestion && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-gray-800">Would you group with them again?</p>
          <div className="flex justify-center mt-2 gap-4">
            <button
              onClick={() => handleRejoinRating(true)}
              disabled={selectedRejoinRating !== null}
              className={`px-4 py-2 text-base font-medium ${selectedRejoinRating === true ? "bg-green-500 text-white" : "text-black bg-white"
                } border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none`}
            >
              Yes
            </button>
            <button
              onClick={() => handleRejoinRating(false)}
              disabled={selectedRejoinRating !== null}
              className={`px-4 py-2 text-base font-medium ${selectedRejoinRating === false ? "bg-red-500 text-white" : "text-black bg-white"
                } border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none`}
            >
              No
            </button>
          </div>
        </div>
      )}
      {showThankYouMessage && (
        <div className="mt-4 text-center text-lg text-green-700 flex items-center justify-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span className="font-semibold">Thank you! Rejoin Rating submitted.</span>
        </div>
      )}
    </div>
  );
};
