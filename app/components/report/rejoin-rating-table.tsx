import React from "react";

interface RejoinRatingStat {
  name: string;
  positiveVotes: number; // Yes votes
  negativeVotes: number; // No votes
}

interface RejoinRatingTableProps {
  data: RejoinRatingStat[];
}

export default function RejoinRatingTable({ data }: RejoinRatingTableProps) {
  console.log(data);
  return (
    <div className="rounded-lg bg-gray-800 pt-4 md:pt-6 text-white shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">
        Rejoin Rating Statistics
      </h3>

      {/* Table for larger screens */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-gray-400 border-b border-gray-700 md:px-4">
                  Player Name
                </th>
                <th className="px-2 py-2 text-right text-gray-400 border-b border-gray-700 md:px-4">
                  - Votes
                </th>
                <th className="px-2 py-2 text-right text-gray-400 border-b border-gray-700 md:px-4">
                  + Votes
                </th>
                <th className="px-2 py-2 text-right text-gray-400 border-b border-gray-700 md:px-4">
                  Total Votes
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
                  <td className="px-2 py-2 text-gray-300 md:px-4">
                    {stat.name}
                  </td>
                  <td className="px-2 py-2 text-right text-gray-300 md:px-4">
                    {stat.negativeVotes}
                  </td>
                  <td className="px-2 py-2 text-right text-gray-300 md:px-4">
                    {stat.positiveVotes}
                  </td>
                  <td className="px-2 py-2 text-right text-gray-300 md:px-4">
                    {stat.positiveVotes + stat.negativeVotes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile-friendly card view */}
      <div className="md:hidden">
        {data.map((stat, index) => (
          <div
            key={index}
            className={`${index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
              } rounded-lg p-4 mb-2 shadow-md`}
          >
            <div className="mb-2 text-lg font-semibold">{stat.name}</div>
            <div className="text-sm text-gray-400">
              <p>
                <strong>- Votes:</strong> {stat.negativeVotes}
              </p>
              <p>
                <strong>+ Votes:</strong> {stat.positiveVotes}
              </p>
              <p>
                <strong>Total Votes:</strong>{" "}
                {stat.positiveVotes + stat.negativeVotes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
