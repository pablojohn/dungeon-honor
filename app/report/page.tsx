import ReportCard from "../components/report/report-card";

export default async function Report() {
  return (
    <div className="container mx-auto flex flex-col gap-8 px-2 py-12 text-center sm:px-12 md:gap-12">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Honor Report
      </h1>
      <p className="text-lg text-gray-300">
        Lookup your own or other honor report cards for the latest season.
      </p>
      <div className="flex flex-col gap-4 rounded-lg border border-gray-700 bg-gray-800 pt-6 text-gray-300">
        <ReportCard />
      </div>
    </div>
  );
}
