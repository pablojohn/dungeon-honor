"use client"

import { useState } from "react";
import BehaviorGraph from "./behavior-graph";

interface BehaviorData {
  data: { key: string }[]; // Adjust this according to your actual API response structure
}

export default function ReportCard() {
  const [name, setName] = useState("");
  const [realm, setRealm] = useState("");
  const [submittedName, setSubmittedName] = useState(""); // Store name after submission
  const [submittedRealm, setSubmittedRealm] = useState(""); // Store realm after submission
  const [error, setError] = useState({ name: false, realm: false });
  const [reportData, setReportData] = useState<BehaviorData | null>(null); // State to hold the API response
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [submitted, setSubmitted] = useState(false); // Track if form has been submitted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const hasError = {
      name: !name.trim(),
      realm: !realm.trim(),
    };

    setError(hasError);

    if (hasError.name || hasError.realm) {
      return; // Stop submission if fields are invalid
    }

    setLoading(true); // Set loading to true when submitting
    setSubmitted(true); // Mark the form as submitted

    // Store submitted name and realm after successful form submission
    setSubmittedName(name);
    setSubmittedRealm(realm);

    try {
      const response = await fetch(
        `/api/getBehavior?name=${encodeURIComponent(name)}&realm=${encodeURIComponent(realm)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReportData(data); // Set the response data into state
        setName("");
        setRealm("");
        setError({ name: false, realm: false }); // Clear errors
      } else {
        // If API returns a bad response (e.g., 404), reset the report data
        setReportData(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setReportData(null); // Reset report data on error
    } finally {
      setLoading(false); // Reset loading state after the API call
    }
  };

  // Function to process data and aggregate the counts for each behavior type
  const processGraphData = () => {
    if (!reportData?.data) return [];  // reportData could be null, so we need to check both

    const labels = reportData.data.map(item => {
      const behaviorName = item.key.split(':').pop()?.trim();
      return behaviorName || '';  // Fallback if the split doesn't produce a valid name
    });

    // Define the type for the labelCount object
    type LabelCount = {
      [key: string]: number;
    };

    // Count occurrences of each label
    const labelCount = labels.reduce((acc: LabelCount, label) => {
      if (label) {  // Only count valid labels
        acc[label] = (acc[label] || 0) + 1;
      }
      return acc;
    }, {} as LabelCount);

    // Convert label counts to a format suitable for recharts
    return Object.keys(labelCount).map(label => ({
      name: label,
      value: labelCount[label],  // Number of occurrences of each behavior
    }));
  };

  const chartData = processGraphData();

  return (
    <div className="flex justify-center items-start bg-gray-100 pt-20 pb-10 w-full">
      <div className="flex flex-col items-center space-y-6 w-full max-w-xl">
        <form
          className="flex flex-col items-center space-y-6 w-full"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-semibold text-center">Report Card</h1>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              className={`w-full px-6 py-3 rounded-full border ${error.name ? "border-red-500" : "border-gray-300"
                } shadow-md focus:outline-none focus:ring-2 ${error.name ? "focus:ring-red-500" : "focus:ring-blue-500"
                } text-center`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase())}
            />
            {error.name && (
              <p className="mt-1 text-sm text-red-500 text-center">
                Name is required.
              </p>
            )}
          </div>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              className={`w-full px-6 py-3 rounded-full border ${error.realm ? "border-red-500" : "border-gray-300"
                } shadow-md focus:outline-none focus:ring-2 ${error.realm ? "focus:ring-red-500" : "focus:ring-blue-500"
                } text-center`}
              placeholder="Enter your realm"
              value={realm}
              onChange={(e) => setRealm(e.target.value.toLowerCase())}
            />
            {error.realm && (
              <p className="mt-1 text-sm text-red-500 text-center">
                Realm is required.
              </p>
            )}
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
              <p className="text-center text-xl font-semibold text-gray-600">
                No report card data found.
              </p>
            </div>
          )}
          {submitted && !loading && reportData && reportData.data.length === 0 ? (
            <div className="flex justify-center mt-4 w-full">
              <p className="text-center text-xl font-semibold text-gray-600">
                No report card data found.
              </p>
            </div>
          ) : (
            reportData && <BehaviorGraph
              name={submittedName} // Pass the submitted name
              realm={submittedRealm} // Pass the submitted realm
              chartData={chartData}
            />
          )}

        </div>
      </div>
    </div>
  );
}
