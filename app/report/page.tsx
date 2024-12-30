import ReportCard from "../components/report-card"

export default async function Report() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">WoW Behave - Report Card</h1>
      <div>
        Lookup your own or other peoples behavior report card
      </div>
      <ReportCard />
    </div>
  )
}