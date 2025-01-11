import React from "react";

interface BehaviorStat {
  name: string;
  score: number;
  positiveVotes: number;
  negativeVotes: number;
}

interface BehaviorTableProps {
  data: BehaviorStat[];
}

export default function BehaviorTable({ data }: BehaviorTableProps) {
  // Define a mapping of behavior names to colors
  const behaviorColors: { [key: string]: string } = {
    "Big Dam": "text-red-500",
    "Uses Defensives": "text-blue-500",
    "Good Comms": "text-yellow-500",
    "Giga Heals": "text-green-500",
  };

  return (
    <div className="rounded-lg bg-gray-800 pt-4 md:pt-6 text-white shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">
        Behavior Statistics
      </h3>

      <div>
        {/* For larger screens */}
        <div className="hidden md:block">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-gray-400 border-b border-gray-700 md:px-4">
                  Behavior Name
                </th>
                <th className="px-2 py-2 text-right text-gray-400 border-b border-gray-700 md:px-4">
                  + Votes
                </th>
                <th className="px-2 py-2 text-right text-gray-400 border-b border-gray-700 md:px-4">
                  - Votes
                </th>
                <th className="px-2 py-2 text-right text-gray-400 border-b border-gray-700 md:px-4">
                  Total Votes
                </th>
                <th className="px-2 py-2 text-right text-gray-400 border-b border-gray-700 md:px-4">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((stat, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                    } hover:bg-gray-700 transition`}
                >
                  <td
                    className={`px-2 py-2 md:px-4 ${behaviorColors[stat.name] || "text-gray-300"
                      }`}
                  >
                    {stat.name}
                  </td>
                  <td className="px-2 py-2 text-right text-gray-300 md:px-4">
                    {stat.positiveVotes}
                  </td>
                  <td className="px-2 py-2 text-right text-gray-300 md:px-4">
                    {stat.negativeVotes}
                  </td>
                  <td className="px-2 py-2 text-right text-gray-300 md:px-4">
                    {stat.positiveVotes + stat.negativeVotes}
                  </td>
                  <td className="px-2 py-2 text-right text-gray-300 md:px-4">
                    {stat.score.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* For smaller screens */}
        <div className="block md:hidden">
          {data.map((stat, index) => (
            <div
              key={index}
              className={`p-4 mb-4 rounded-lg ${index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                }`}
            >
              <div className="flex justify-between">
                <span className="text-gray-400">Behavior Name:</span>
                <span
                  className={`${behaviorColors[stat.name] || "text-gray-300"}`}
                >
                  {stat.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">+ Votes:</span>
                <span className="text-gray-300">{stat.positiveVotes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">- Votes:</span>
                <span className="text-gray-300">{stat.negativeVotes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Votes:</span>
                <span className="text-gray-300">
                  {stat.positiveVotes + stat.negativeVotes}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Score:</span>
                <span className="text-gray-300">{stat.score.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
