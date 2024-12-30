"use client"

import { useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ReportCard() {
  const [name, setName] = useState("");
  const [realm, setRealm] = useState("");
  const [error, setError] = useState({ name: false, realm: false });
  const [reportData, setReportData] = useState(null); // State to hold the API response
  const [loading, setLoading] = useState(false); // State to manage loading state

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
        alert("Error submitting. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false); // Reset loading state after the API call
    }
  };

  // Function to process data and aggregate the counts for each behavior type

  const processGraphData = () => {
    if (!reportData?.data) return [];

    // Extract behavior names and ensure there's no accidental whitespace or variation
    const labels = reportData.data.map(item => {
      const behaviorName = item.key.split(':').pop()?.trim(); // Ensure any extra spaces are removed
      return behaviorName || '';  // Fallback if the split doesn't produce a valid name
    });

    console.log('Extracted Behavior Names:', labels); // Debugging: Check the behavior names

    // Count occurrences of each label
    const labelCount = labels.reduce((acc, label) => {
      if (label) {  // Only count valid labels
        acc[label] = (acc[label] || 0) + 1;
      }
      return acc;
    }, {});

    console.log('Behavior Counts:', labelCount); // Debugging: Check the counts of each behavior type

    // Convert label counts to a format suitable for recharts
    return Object.keys(labelCount).map(label => ({
      name: label,
      value: labelCount[label],  // Number of occurrences of each behavior
    }));
  };

  const chartData = processGraphData();

  const getBarColor = (name: string) => {
    switch (name) {
      case "Good Comms":
        return "#28a745"; // Green
      case "Giga Heals":
        return "#ffc107"; // Yellow
      case "Big Dam":
        return "#dc3545"; // Red
      default:
        return "#8884d8"; // Default color (optional)
    }
  };

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
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setRealm(e.target.value)}
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

        {/* Section below the form to show loading or API content */}
        <div className="mt-6 w-full">
          {/* Loading indicator */}
          {loading && <p className="text-center text-blue-500">Loading...</p>}

          {/* Displaying API response data */}
          {reportData && !loading && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold">PUT CHAR NAME HERE</h2>
              {/* Display the graph */}
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" radius={5}>
                      {chartData.map((data, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(data.name)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
