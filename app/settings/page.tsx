"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Settings() {
  const operationsCount = useStore((state) => state.operationsCount)
  const setOperationsCount = useStore((state) => state.setOperationsCount)

  return (
    <div className="flex-1 flex flex-col gap-6 py-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Card className="rounded-2xl shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Run Length</CardTitle>
          <CardDescription>
            Configure the number of operations per run.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Operations Count</span>
            <span className="text-xl font-bold text-primary">{operationsCount}</span>
          </div>
          <Slider
            value={[operationsCount]}
            onValueChange={(vals) => setOperationsCount(Array.isArray(vals) ? vals[0] : vals)}
            min={2}
            max={20}
            step={1}
            className="py-4"
          />
        </CardContent>
      </Card>
    </div>
  )
}
