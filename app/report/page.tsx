import ReportCard from "../components/report/report-card"

export default async function Report() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Honor Report</h1>
      <div>
        Lookup your own or other peoples honor report card
      </div>
      <ReportCard />
    </div>
  )
}