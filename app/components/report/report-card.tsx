"use client";

import { useState } from "react";
import BehaviorGraph from "./behavior-graph";
import RejoinRatingGraph from "./rejoin-rating-graph";
import HonorScore from "./honor-score";
import BehaviorTable from "./behavior-table";
import RejoinRatingTable from "./rejoin-rating-table";
import Link from "next/link";

interface BehaviorData {
  data: { key: string }[];
}

interface RejoinData {
  success: boolean;
  data: { key: string }[];
  message: string;
}

export default function ReportCard() {
  const [name, setName] = useState("");
  const [realm, setRealm] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [submittedRealm, setSubmittedRealm] = useState("");
  const [error, setError] = useState({ name: false, realm: false });
  const [reportData, setReportData] = useState<BehaviorData | null>(null);
  const [rejoinData, setRejoinData] = useState<RejoinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState("behaviors");

  const calculateTeammateScore = (behaviorData: BehaviorData, rejoinData: RejoinData) => {
    if (!behaviorData?.data || !rejoinData?.data) return 0;

    const categoryScores: { [key: string]: number } = { big_dam: 0, uses_defensives: 0, good_comms: 0, giga_heals: 0 };

    behaviorData.data.forEach((item) => {
      const segments = item.key.split(":");
      const behaviorName = segments[segments.length - 2].replace(" ", "_").toLowerCase();
      const value = parseInt(segments[segments.length - 1], 10);

      if (categoryScores.hasOwnProperty(behaviorName)) {
        categoryScores[behaviorName] += value;
      }
    });

    const totalCategoryScore =
      (categoryScores.big_dam + categoryScores.uses_defensives + categoryScores.good_comms + categoryScores.giga_heals) / 4;

    const normalizedCategoryScore = ((totalCategoryScore + 1) / 2) * 100;

    const rejoinScore = rejoinData.data.reduce((sum, item) => (item.key === "yes" ? sum + 1 : sum), 0);
    const rejoinRate = rejoinScore / rejoinData.data.length;

    return normalizedCategoryScore + rejoinRate * 10;
  };

  const processBehaviorData = () => {
    if (!reportData?.data) return [];
    const labelsAndValues = reportData.data.map((item) => {
      const segments = item.key.split(":");
      const behaviorName = segments[segments.length - 2];
      const value = parseInt(segments[segments.length - 1], 10);
      return { behaviorName, value };
    });

    const labelSum: { [key: string]: number } = {};
    labelsAndValues.forEach(({ behaviorName, value }) => {
      if (behaviorName) {
        labelSum[behaviorName] = (labelSum[behaviorName] || 0) + value;
      }
    });

    return Object.keys(labelSum).map((behaviorName) => ({
      name: behaviorName,
      value: labelSum[behaviorName],
    }));
  };

  const processBehaviorDataForStatistics = () => {
    if (!reportData?.data) return [];

    const labelsAndValues = reportData.data.map((item) => {
      const segments = item.key.split(":");
      const behaviorName = segments[segments.length - 2];
      const value = parseInt(segments[segments.length - 1], 10);
      return { behaviorName, value };
    });

    const labelSum: { [key: string]: { positive: number; negative: number } } = {};

    labelsAndValues.forEach(({ behaviorName, value }) => {
      if (behaviorName) {
        if (!labelSum[behaviorName]) {
          labelSum[behaviorName] = { positive: 0, negative: 0 };
        }
        if (value > 0) {
          labelSum[behaviorName].positive += value;
        } else {
          labelSum[behaviorName].negative += Math.abs(value);
        }
      }
    });

    return Object.keys(labelSum).map((behaviorName) => ({
      name: behaviorName,
      score: labelSum[behaviorName].positive - labelSum[behaviorName].negative,
      positiveVotes: labelSum[behaviorName].positive,
      negativeVotes: labelSum[behaviorName].negative,
    }));
  };

  const processRejoinDataForStatistics = () => {
    if (!rejoinData?.data) return [];

    const positiveVotes = rejoinData.data.filter((item) => {
      const segments = item.key.split(":");
      return segments[segments.length - 1] === "true";
    }).length;

    const negativeVotes = rejoinData.data.filter((item) => {
      const segments = item.key.split(":");
      return segments[segments.length - 1] === "false";
    }).length;

    return [
      {
        name: "Rejoin Rating",
        positiveVotes,
        negativeVotes,
      },
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasError = { name: !name.trim(), realm: !realm.trim() };
    setError(hasError);

    if (hasError.name || hasError.realm) return;

    setLoading(true);
    setSubmitted(true);
    setSubmittedName(name);
    setSubmittedRealm(realm);

    try {
      const behaviorResponse = await fetch(`/api/behaviors?name=${encodeURIComponent(name)}&realm=${encodeURIComponent(realm)}`);
      const rejoinResponse = await fetch(`/api/rejoinRatings?name=${encodeURIComponent(name)}&realm=${encodeURIComponent(realm)}`);

      if (behaviorResponse.ok && rejoinResponse.ok) {
        const behaviorData = await behaviorResponse.json();
        const rejoinData = await rejoinResponse.json();

        setReportData(behaviorData);
        setRejoinData(rejoinData);
      } else {
        setReportData(null);
        setRejoinData(null);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const behaviorChartData = processBehaviorData();

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg bg-gray-800 p-6 text-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">
        Search for a Character
        <span className="block text-lg font-normal text-gray-400">
          Enter character details below
        </span>
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative w-full">
          <input
            type="text"
            className={`w-full px-6 py-4 text-center rounded-md border ${error.name ? "border-red-500" : "border-gray-700"
              } bg-gray-900 text-white focus:outline-none focus:ring-2 ${error.name ? "focus:ring-red-500" : "focus:ring-blue-500"
              } placeholder-gray-500 shadow-md`}
            placeholder="Enter character name"
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase())}
          />
          {error.name && (
            <p className="mt-1 text-sm text-red-400 text-center">
              Name is required.
            </p>
          )}
        </div>
        <div className="relative w-full">
          <input
            type="text"
            className={`w-full px-6 py-4 text-center rounded-md border ${error.realm ? "border-red-500" : "border-gray-700"
              } bg-gray-900 text-white focus:outline-none focus:ring-2 ${error.realm ? "focus:ring-red-500" : "focus:ring-blue-500"
              } placeholder-gray-500 shadow-md`}
            placeholder="Enter realm"
            value={realm}
            onChange={(e) => setRealm(e.target.value.toLowerCase())}
          />
          {error.realm && (
            <p className="mt-1 text-sm text-red-400 text-center">
              Realm is required.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-6 py-4 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
        >
          Submit
        </button>
      </form>

      {submitted && (
        <div className="flex flex-col gap-6 mt-6"
          style={{
            animation: 'fadeInScale 0.5s forwards',
          }}>
          {loading && (
            <p className="text-center text-xl font-semibold text-gray-400">Loading report card...</p>
          )}
          {!loading && !reportData && (
            <div className="flex justify-center">
              <p className="text-center text-xl font-semibold text-gray-400">
                No honor found for this champion.
              </p>
            </div>
          )}
          {!loading && reportData && (
            <>
              <h2 className="text-xl font-bold text-center">
                Report for{" "}
                <Link
                  href={`https://raider.io/characters/us/${submittedRealm.toLowerCase()}/${submittedName.toLowerCase()}`}
                  className="underline text-blue-400 hover:text-blue-300 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {submittedName.charAt(0).toUpperCase() +
                    submittedName.slice(1)}{" "}
                  -{" "}
                  {submittedRealm.charAt(0).toUpperCase() +
                    submittedRealm.slice(1)}
                </Link>
              </h2>
              <HonorScore score={calculateTeammateScore(reportData, rejoinData!)} />

              <div className="flex justify-center items-center gap-4 mt-4">
                <span
                  className={`cursor-pointer font-semibold ${view === "behaviors" ? "text-white" : "text-gray-400"
                    }`}
                  onClick={() => setView("behaviors")}
                >
                  Behaviors
                </span>
                <div
                  className="w-16 h-8 bg-gray-600 rounded-full flex items-center cursor-pointer p-1"
                  onClick={() =>
                    setView((prev) => (prev === "behaviors" ? "rejoin" : "behaviors"))
                  }
                >
                  <div
                    className={`w-6 h-6 bg-blue-500 rounded-full shadow-md transform transition-transform duration-200 ${view === "rejoin" ? "translate-x-8" : ""
                      }`}
                  ></div>
                </div>
                <span
                  className={`cursor-pointer font-semibold ${view === "rejoin" ? "text-white" : "text-gray-400"
                    }`}
                  onClick={() => setView("rejoin")}
                >
                  Rejoin Rating
                </span>
              </div>

              {view === "behaviors" ? (
                <div className="mt-6 rounded-md bg-gray-900 p-4 shadow-md">
                  <BehaviorGraph chartData={behaviorChartData} />
                </div>
              ) : (
                <div className="mt-6 rounded-md bg-gray-900 p-4 shadow-md">
                  <RejoinRatingGraph rejoinData={rejoinData} />
                </div>
              )}
              <div className="mt-6">
                {view === "behaviors" ? (
                  <BehaviorTable data={processBehaviorDataForStatistics()} />
                ) : (
                  <RejoinRatingTable data={processRejoinDataForStatistics()} />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
