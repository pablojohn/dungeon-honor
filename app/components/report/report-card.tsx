"use client"

import { useState } from "react";
import BehaviorGraph from "./behavior-graph";
import RejoinRatingGraph from "./rejoin-rating-graph"; // Import the new component

interface BehaviorData {
  data: { key: string }[]; // Adjust this according to your actual API response structure
}

interface RejoinData {
  success: boolean;
  data: { key: string }[];
  message: string;
}

export default function ReportCard() {
  const [name, setName] = useState("");
  const [realm, setRealm] = useState("");
  const [submittedName, setSubmittedName] = useState(""); // Store name after submission
  const [submittedRealm, setSubmittedRealm] = useState(""); // Store realm after submission
  const [error, setError] = useState({ name: false, realm: false });
  const [reportData, setReportData] = useState<BehaviorData | null>(null); // State to hold the API response
  const [rejoinData, setRejoinData] = useState<RejoinData | null>(null); // State for rejoin data
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
      // Fetch behavior data
      const behaviorResponse = await fetch(
        `/api/getBehavior?name=${encodeURIComponent(name)}&realm=${encodeURIComponent(realm)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (behaviorResponse.ok) {
        const data = await behaviorResponse.json();
        console.log("Behavior data:", data); // Log the response data
        setReportData(data); // Set the behavior data into state
      } else {
        setReportData(null);
      }

      // Fetch rejoin rating data
      const rejoinResponse = await fetch(
        `/api/getRejoinRating?name=${encodeURIComponent(name)}&realm=${encodeURIComponent(realm)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (rejoinResponse.ok) {
        const rejoinData = await rejoinResponse.json();
        console.log("Rejoin rating data:", rejoinData); // Log the response data
        setRejoinData(rejoinData); // Set the rejoin rating data into state
      } else {
        setRejoinData(null);
      }

      setName("");
      setRealm("");
      setError({ name: false, realm: false }); // Clear errors
    } catch (error) {
      console.error("Error:", error);
      setReportData(null); // Reset report data on error
      setRejoinData(null); // Reset rejoin data on error
    } finally {
      setLoading(false); // Reset loading state after the API call
    }
  };

  // Function to process behavior data and return chart-friendly data
  const processBehaviorData = () => {
    if (!reportData?.data) return [];

    // Step 1: Extract behavior names and values from the data
    const labelsAndValues = reportData.data.map(item => {
      const segments = item.key.split(':');
      const behaviorName = segments[segments.length - 2]; // Name before the last segment
      const value = parseInt(segments[segments.length - 1], 10); // Last segment is the value

      return { behaviorName, value };
    });

    // Step 2: Sum the values for each behavior
    const labelSum: { [key: string]: number } = {};

    labelsAndValues.forEach(({ behaviorName, value }) => {
      if (behaviorName) {
        labelSum[behaviorName] = (labelSum[behaviorName] || 0) + value;
      }
    });

    // Step 3: Convert the sum into a format suitable for the chart
    return Object.keys(labelSum).map(behaviorName => ({
      name: behaviorName,
      value: labelSum[behaviorName],  // Sum of values for each behavior
    }));
  };


  const behaviorChartData = processBehaviorData();

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
            reportData && (
              <>
                {/* Title with name, realm, and season */}
                <h2 className="text-2xl text-center font-semibold mt-6">
                  Report for {submittedName} in {submittedRealm} for TWW Season 1
                </h2>
                <BehaviorGraph chartData={behaviorChartData} /> {/* No need to pass name and realm */}
              </>
            )
          )}

          {/* Display the Rejoin Rating Chart */}
          {submitted && !loading && rejoinData && (
            <RejoinRatingGraph rejoinData={rejoinData} />
          )}
        </div>
      </div>
    </div>
  );
}
