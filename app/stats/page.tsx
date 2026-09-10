"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LineChart } from "@/components/charts/line-chart"
import { Line } from "@/components/charts/line"
import { Grid } from "@/components/charts/grid"
import { ChartTooltip } from "@/components/charts/tooltip"
import { useMemo } from "react"

export default function Stats() {
  const history = useStore((state) => state.history)

  const chartData = useMemo(() => {
    // Only get correct answers for the speed chart
    return history
      .filter((run) => run.isCorrect)
      .slice(-20) // Last 20 runs
      .map((run, i) => ({
        date: new Date(run.date).toLocaleDateString() + " " + new Date(run.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        time: run.timeMs / 1000,
        index: i + 1,
      }))
  }, [history])

  const totalRuns = history.length
  const correctRuns = history.filter((r) => r.isCorrect).length
  const accuracy = totalRuns > 0 ? ((correctRuns / totalRuns) * 100).toFixed(1) : "0.0"

  return (
    <div className="flex-1 flex flex-col gap-6 py-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-2xl shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRuns}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accuracy}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm border-slate-200 flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Completion Time (Seconds)</CardTitle>
          <CardDescription>
            Your time for the last 20 correct runs.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px]">
          {chartData.length > 0 ? (
            <LineChart
              data={chartData}
              xDataKey="index"
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              className="w-full h-full"
            >
              <Grid />
              <Line dataKey="time" stroke="#0ea5e9" strokeWidth={3} />
              <ChartTooltip />
            </LineChart>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Complete more runs to see your progress!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
