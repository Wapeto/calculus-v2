"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { generateEquation, Equation } from "@/lib/math"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { ArrowLeft, Check, X, Timer, Delete } from "lucide-react"

export default function Run() {
  const operationsRange = useStore((state) => state.operationsRange)
  const addRun = useStore((state) => state.addRun)

  const [equation, setEquation] = useState<Equation | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [startTime, setStartTime] = useState<number>(0)
  const [finished, setFinished] = useState(false)
  
  // Results
  const [timeTaken, setTimeTaken] = useState<number>(0)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    // Initialize the run
    setEquation(generateEquation(operationsRange))
    setStartTime(Date.now())
  }, [operationsRange])

  const handleInput = (val: string) => {
    if (val === '-') {
      if (inputValue.startsWith('-')) {
        setInputValue(inputValue.slice(1))
      } else {
        setInputValue('-' + inputValue)
      }
      return
    }
    
    if (inputValue === '0' && val !== '0') {
      setInputValue(val)
    } else if (inputValue === '-0') {
      setInputValue('-' + val)
    } else {
      if (inputValue.length < 8) {
        setInputValue(prev => prev + val)
      }
    }
  }

  const handleDelete = () => {
    setInputValue(prev => prev.slice(0, -1))
  }

  const handleSubmit = () => {
    if (!equation || finished || inputValue.trim() === "") return

    const endTime = Date.now()
    const taken = endTime - startTime
    const answer = parseInt(inputValue, 10)
    const correct = answer === equation.answer

    setTimeTaken(taken)
    setIsCorrect(correct)
    setFinished(true)

    // Save to store
    addRun({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      timeMs: taken,
      isCorrect: correct,
      userAnswer: isNaN(answer) ? null : answer,
      correctAnswer: equation.answer,
      equation: equation.expression
    })
  }

  if (!equation) return null

  return (
    <div className="flex-1 flex flex-col pt-12 pb-6">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 text-center font-medium text-sm text-muted-foreground mr-10">
          Mental Training
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key="running"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <Card className="flex-1 flex flex-col justify-center border-none shadow-none bg-transparent">
              <CardContent className="space-y-10 p-0 text-center">
                <div 
                  className="font-bold tracking-tight text-slate-800 whitespace-nowrap w-full text-center px-1"
                  style={{ fontSize: `min(3rem, calc(190vw / ${equation.expression.length + 4}))` }}
                >
                  {equation.expression} = ?
                </div>
                
                <div className="max-w-xs mx-auto w-full space-y-6">
                  <div className="text-center text-3xl font-medium h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    {inputValue || <span className="text-muted-foreground opacity-50">Result</span>}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <Button 
                        key={num} 
                        variant="outline" 
                        className="h-16 text-2xl rounded-2xl bg-white hover:bg-slate-50 border-slate-200"
                        onClick={() => handleInput(num.toString())}
                      >
                        {num}
                      </Button>
                    ))}
                    <Button variant="outline" className="h-16 text-2xl rounded-2xl bg-white hover:bg-slate-50 border-slate-200" onClick={() => handleInput('-')}>-</Button>
                    <Button variant="outline" className="h-16 text-2xl rounded-2xl bg-white hover:bg-slate-50 border-slate-200" onClick={() => handleInput('0')}>0</Button>
                    <Button variant="outline" className="h-16 text-2xl rounded-2xl bg-slate-100 hover:bg-slate-200 border-none text-slate-600" onClick={handleDelete}>
                      <Delete className="w-6 h-6" />
                    </Button>
                  </div>

                  <Button onClick={handleSubmit} size="lg" className="w-full h-16 rounded-2xl text-xl font-semibold shadow-sm">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-8"
          >
            <div className={`p-6 rounded-full ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {isCorrect ? <Check className="w-16 h-16" /> : <X className="w-16 h-16" />}
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">
                {isCorrect ? "Correct!" : "Incorrect"}
              </h2>
              {!isCorrect && (
                <p className="text-muted-foreground text-lg">
                  The correct answer was {equation.answer}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 text-lg font-medium bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
              <Timer className="w-5 h-5 text-muted-foreground" />
              {(timeTaken / 1000).toFixed(2)} seconds
            </div>

            <div className="w-full space-y-3 mt-4">
              <Button onClick={() => {
                setEquation(generateEquation(operationsRange))
                setInputValue("")
                setFinished(false)
                setStartTime(Date.now())
              }} className="w-full h-14 rounded-2xl text-lg">
                Play Again
              </Button>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full h-14 rounded-2xl text-lg bg-transparent">
                  Home
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
