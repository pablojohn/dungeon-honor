"use client";

import { useState } from "react";
import BehaviorGraph from "./behavior-graph";
import RejoinRatingGraph from "./rejoin-rating-graph";
import BehaviorScore from "./behavior-score";

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

  const calculateTeammateScore = (behaviorData: BehaviorData, rejoinData: RejoinData) => {
    if (!behaviorData?.data || !rejoinData?.data) return 0;

    const categoryScores: { [key: string]: number } = { damage: 0, defense: 0, healing: 0, communication: 0 };

    behaviorData.data.forEach(item => {
      const segments = item.key.split(":");
      const behaviorName = segments[segments.length - 2];
      const value = parseInt(segments[segments.length - 1], 10);

      if (categoryScores.hasOwnProperty(behaviorName)) {
        categoryScores[behaviorName] += value;
      }
    });

    const totalCategoryScore =
      (categoryScores.damage + categoryScores.defense + categoryScores.healing + categoryScores.communication) / 4;

    const normalizedCategoryScore = ((totalCategoryScore + 1) / 2) * 100;

    const rejoinScore = rejoinData.data.reduce((sum, item) => (item.key === "yes" ? sum + 1 : sum), 0);
    const rejoinRate = rejoinScore / rejoinData.data.length;

    return normalizedCategoryScore + rejoinRate * 10;
  };

  const processBehaviorData = () => {
    if (!reportData?.data) return [];
    const labelsAndValues = reportData.data.map(item => {
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

    return Object.keys(labelSum).map(behaviorName => ({
      name: behaviorName,
      value: labelSum[behaviorName],
    }));
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
      const behaviorResponse = await fetch(`/api/getBehavior?name=${encodeURIComponent(name)}&realm=${encodeURIComponent(realm)}`);
      const rejoinResponse = await fetch(`/api/getRejoinRating?name=${encodeURIComponent(name)}&realm=${encodeURIComponent(realm)}`);

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
    <div className="flex justify-center items-start bg-gray-100 pt-20 pb-10 w-full">
      <div className="flex flex-col items-center space-y-6 w-full max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6 w-full">
          <h1 className="text-3xl font-semibold text-center">Report Card</h1>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              className={`w-full px-6 py-3 text-center rounded-full border ${error.name ? "border-red-500" : "border-gray-300"} shadow-md focus:outline-none focus:ring-2 ${error.name ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase())}
            />
            {error.name && <p className="mt-1 text-sm text-red-500 text-center">Name is required.</p>}
          </div>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              className={`w-full px-6 py-3 text-center rounded-full border ${error.realm ? "border-red-500" : "border-gray-300"} shadow-md focus:outline-none focus:ring-2 ${error.realm ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
              placeholder="Enter your realm"
              value={realm}
              onChange={(e) => setRealm(e.target.value.toLowerCase())}
            />
            {error.realm && <p className="mt-1 text-sm text-red-500 text-center">Realm is required.</p>}
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-black text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>

        <div className="mt-6 w-full">
          {loading && <p className="text-center">Loading report card...</p>}
          {submitted && !loading && !reportData && (
            <div className="flex justify-center mt-4 w-full">
              <p className="text-center text-xl font-semibold text-gray-600">No report card data found.</p>
            </div>
          )}
          {submitted && !loading && reportData && reportData.data.length === 0 ? (
            <div className="flex justify-center mt-4 w-full">
              <p className="text-center text-xl font-semibold text-gray-600">No report card data found.</p>
            </div>
          ) : (
            reportData && (
              <>
                <h2 className="text-2xl text-center font-semibold mt-6">
                  Report for {submittedName} in {submittedRealm} for TWW Season 1
                </h2>
                <BehaviorScore score={calculateTeammateScore(reportData, rejoinData!)} />
                <div className="mt-8">
                  <BehaviorGraph chartData={behaviorChartData} />
                </div>
              </>
            )
          )}

          {submitted && !loading && rejoinData && <RejoinRatingGraph rejoinData={rejoinData} />}
        </div>
      </div>
    </div>
  );
}
