import React, { useEffect, useState } from "react";
import {
  Sword,
  Shield,
  Heart,
  ShieldPlus,
  MessageSquareMore,
  HeartPulse,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
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
  } catch (error) {
    console.error("Error in saveRejoinRating:", error);
  }
};

export const RunDetailCard: React.FC<CardProps> = ({ name, realm, role, slug }) => {
  const [selectedBehaviors, setSelectedBehaviors] = useState<{ behavior: string; value: 1 | -1 }[]>([]);
  const [showRejoinQuestion, setShowRejoinQuestion] = useState(false);
  const [selectedRejoinRating, setSelectedRejoinRating] = useState<boolean | null>(null);
  const [flashBorder, setFlashBorder] = useState(false);
  const [flashColor, setFlashColor] = useState<string>();
  const [votedFor, setIfVotedFor] = useState<boolean>();

  const handleBehaviorClick = (behavior: string, value: 1 | -1, color: string) => {
    if (!selectedBehaviors.some((b) => b.behavior === behavior && b.value === value)) {
      setSelectedBehaviors([...selectedBehaviors, { behavior, value }]);
      saveBehaviorToUpstash(slug, `${behavior}:${value}`);
    }

    // Only show the rejoin question if it hasn't been answered yet
    if (selectedRejoinRating === null) {
      setShowRejoinQuestion(true);
    }

    // Flash effect for behavior selection
    setFlashColor(color);
    setFlashBorder(true);
    setTimeout(() => setFlashBorder(false), 300);
  };

  const handleRejoinRating = (rating: boolean, color: string) => {
    saveRejoinRating(slug, rating);
    setSelectedRejoinRating(rating);

    // Show thank-you message and hide rejoin question
    setShowRejoinQuestion(false);

    // Flash effect for rejoin rating
    setFlashColor(color);
    setFlashBorder(true);
    setTimeout(() => setFlashBorder(false), 400);
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

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch(`/api/votes?slug=${slug}`)

        if (!response.ok) {
          throw new Error('Failed to fetch votes');
        }

        const data = await response.json();
        setIfVotedFor(data.success);
      } catch (err) {
        console.error(err);
      }
    }

    fetchVotes();
  }, [slug, votedFor]);

  if (votedFor) {
    return (
      <div className="w-full mx-auto p-2 sm:p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg text-white">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-blue-400">{name}</h2>
          <p className="text-sm text-gray-300">{realm}</p>
          <p className="mt-2 flex justify-center">{renderRoleIcon()}</p>
        </div>
        <div className="mt-6 text-center">
          <span className="font-semibold text-lg text-gray-300">
            Thanks for your input! Your feedback has helped shaped their honor.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full mx-auto p-2 sm:p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg text-white transition-border duration-400 ${flashBorder ? flashColor : "border-gray-700"
        } border-2`}
    >
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-blue-400">{name}</h2>
        <p className="text-sm text-gray-300">{realm}</p>
        <p className="mt-2 flex justify-center">{renderRoleIcon()}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 justify-center mt-6">
        <div className="flex justify-center">
          <DualButton
            title={"Big Dam"}
            icon={<Sword className="w-5 h-5 mr-2" />}
            color="red"
            onPlusClick={() => handleBehaviorClick("Big Dam", 1, "border-green-600")}
            onMinusClick={() => handleBehaviorClick("Big Dam", -1, "border-red-600")}
          />
        </div>
        <div className="flex justify-center">
          <DualButton
            title="Uses Defensives"
            icon={<ShieldPlus className="w-5 h-5" />}
            color="blue"
            onPlusClick={() => handleBehaviorClick("Uses Defensives", 1, "border-green-600")}
            onMinusClick={() => handleBehaviorClick("Uses Defensives", -1, "border-red-600")}
          />
        </div>
        <div className="flex justify-center">
          <DualButton
            title="Good Comms"
            icon={<MessageSquareMore className="w-5 h-5 mr-2" />}
            color="yellow"
            onPlusClick={() => handleBehaviorClick("Good Comms", 1, "border-green-600")}
            onMinusClick={() => handleBehaviorClick("Good Comms", -1, "border-red-600")}
          />
        </div>
        <div className="flex justify-center">
          <DualButton
            title="Giga Heals"
            icon={<HeartPulse className="w-5 h-5 mr-2" />}
            color="green"
            onPlusClick={() => handleBehaviorClick("Giga Heals", 1, "border-green-600")}
            onMinusClick={() => handleBehaviorClick("Giga Heals", -1, "border-red-600")}
          />
        </div>
      </div>

      {selectedBehaviors.length > 0 && (
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {selectedBehaviors.map(({ behavior, value }) => (
              <div key={`${behavior}-${value}`} className="flex items-center gap-2">
                {value === 1 ? (
                  <ThumbsUp className="w-6 h-6 text-green-500" />
                ) : (
                  <ThumbsDown className="w-6 h-6 text-red-500" />
                )}
                <span className="text-lg font-semibold text-gray-300">{behavior}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showRejoinQuestion && selectedRejoinRating === null && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-300">Would you group with them again?</p>
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={() => handleRejoinRating(true, "border-cyan-600")}
              className={`px-4 py-2 rounded-lg border transition ${selectedRejoinRating === true ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleRejoinRating(false, "border-orange-600")}
              className={`px-4 py-2 rounded-lg border transition ${selectedRejoinRating === false ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              No
            </button>
          </div>
        </div>
      )}

      {selectedRejoinRating !== null && (
        <div className="mt-6 text-center flex items-center justify-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span className="font-semibold text-lg">Thank you! Rejoin rating submitted.</span>
        </div>
      )}
    </div>
  );
};
