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
import { useChartStable } from "@/components/charts/chart-context"
import { useMemo } from "react"

function YAxis() {
  const { yScale, xScale, data, xAccessor, innerHeight, margin } = useChartStable()
  const yTicks = yScale.ticks(5)
  const xTicks = data.filter((_, i) => i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1)

  return (
    <g className="chart-axes">
      {/* Y-Axis */}
      {yTicks.map((tick) => (
        <text
          key={`y-${tick}`}
          x={margin.left - 5}
          y={yScale(tick) + margin.top}
          textAnchor="end"
          alignmentBaseline="middle"
          fill="currentColor"
          className="text-[10px] text-slate-400 font-medium"
        >
          {tick}s
        </text>
      ))}
      
      {/* X-Axis */}
      {xTicks.map((d, i) => (
        <text
          key={`x-${i}`}
          x={xScale(xAccessor(d)) + margin.left}
          y={innerHeight + margin.top + 15}
          textAnchor="middle"
          fill="currentColor"
          className="text-[10px] text-slate-400 font-medium"
        >
          #{d.index as number}
        </text>
      ))}
    </g>
  )
}
YAxis.displayName = "YAxis"


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
  const correctHistory = history.filter((r) => r.isCorrect)
  const accuracy = totalRuns > 0 ? ((correctHistory.length / totalRuns) * 100).toFixed(1) : "0.0"

  const avgTime = correctHistory.length > 0 
    ? (correctHistory.reduce((acc, r) => acc + r.timeMs, 0) / correctHistory.length / 1000).toFixed(2)
    : "0.00"
    
  const bestTime = correctHistory.length > 0 
    ? (Math.min(...correctHistory.map(r => r.timeMs)) / 1000).toFixed(2)
    : "0.00"

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
        <Card className="rounded-2xl shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bestTime}<span className="text-lg font-medium text-muted-foreground ml-1">s</span></div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgTime}<span className="text-lg font-medium text-muted-foreground ml-1">s</span></div>
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
              margin={{ top: 20, right: 20, bottom: 30, left: 35 }}
              className="w-full h-full"
            >
              <Grid />
              <YAxis />
              <Line dataKey="time" stroke="#0ea5e9" strokeWidth={3} />
              <ChartTooltip 
                showDatePill={false}
                content={({ point }) => (
                  <div className="bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-lg flex flex-col gap-2 min-w-[150px]">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Run #{point.index as number}</span>
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">{point.date as string}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"></div>
                      <span className="text-sm font-medium text-slate-700">Time</span>
                      <span className="text-sm font-bold text-slate-900 ml-auto">{Number(point.time).toFixed(2)}s</span>
                    </div>
                  </div>
                )}
              />
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
