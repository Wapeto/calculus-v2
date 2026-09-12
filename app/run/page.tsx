"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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

  const containerRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState<number | null>(null)

  const updateFontSize = useCallback(() => {
    if (!containerRef.current || !equation) return
    const containerWidth = containerRef.current.clientWidth
    if (!containerWidth) return

    // Measure exact width using a hidden DOM element to correctly parse CSS variables
    const span = document.createElement("span")
    span.style.visibility = "hidden"
    span.style.position = "absolute"
    span.style.whiteSpace = "nowrap"
    span.style.fontFamily = "var(--font-geist-sans), system-ui, sans-serif"
    span.style.fontWeight = "bold"
    span.style.fontSize = "100px"
    span.innerText = `${equation.expression} = ?`
    document.body.appendChild(span)
    
    const textWidthAt100 = span.getBoundingClientRect().width
    document.body.removeChild(span)

    if (!textWidthAt100) return

    // Target 95% of container width to fill the space cleanly without overflowing
    const targetWidth = containerWidth * 0.95
    const calculatedSize = (targetWidth / textWidthAt100) * 100
    
    // Max 44px (2.75rem), min 16px
    const finalSize = Math.max(16, Math.min(calculatedSize, 44))
    setFontSize(Number(finalSize.toFixed(1)))
  }, [equation])

  useEffect(() => {
    updateFontSize()
    window.addEventListener("resize", updateFontSize)
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(updateFontSize)
    }
    return () => window.removeEventListener("resize", updateFontSize)
  }, [updateFontSize])

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
    <div className="flex-1 flex flex-col justify-between min-h-0 h-full max-h-full">
      <div className="flex items-center mb-1 sm:mb-3 shrink-0">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 text-center font-medium text-sm text-muted-foreground mr-9">
          Mental Training
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key="running"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between min-h-0"
          >
            {/* Equation area: flexible and vertically centered in remaining upper space */}
            <div ref={containerRef} className="flex-1 flex items-center justify-center min-h-[3rem] py-1 text-center w-full overflow-hidden">
              <div 
                className="font-bold tracking-tight text-slate-800 whitespace-nowrap text-center select-none"
                style={{ 
                  fontSize: fontSize 
                    ? `${fontSize}px` 
                    : `min(2.75rem, calc(190vw / ${equation.expression.length + 4}))` 
                }}
              >
                {equation.expression} = ?
              </div>
            </div>
            
            {/* Keypad & Input controls: compact, ergonomic, always visible without scrolling */}
            <div className="max-w-xs mx-auto w-full flex flex-col gap-2 sm:gap-2.5 pb-1">
              <div className="text-center text-2xl sm:text-3xl font-medium h-11 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                {inputValue || <span className="text-muted-foreground opacity-40">Result</span>}
              </div>
              
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 shrink-0">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button 
                    key={num} 
                    variant="outline" 
                    className="h-11 sm:h-13 md:h-14 text-xl sm:text-2xl rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border-slate-200 active:scale-95 transition-transform touch-manipulation select-none"
                    onClick={() => handleInput(num.toString())}
                  >
                    {num}
                  </Button>
                ))}
                <Button variant="outline" className="h-11 sm:h-13 md:h-14 text-xl sm:text-2xl rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border-slate-200 active:scale-95 transition-transform touch-manipulation select-none" onClick={() => handleInput('-')}>-</Button>
                <Button variant="outline" className="h-11 sm:h-13 md:h-14 text-xl sm:text-2xl rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border-slate-200 active:scale-95 transition-transform touch-manipulation select-none" onClick={() => handleInput('0')}>0</Button>
                <Button variant="outline" className="h-11 sm:h-13 md:h-14 text-xl sm:text-2xl rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 border-none text-slate-600 active:scale-95 transition-transform touch-manipulation select-none" onClick={handleDelete}>
                  <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </div>

              <Button onClick={handleSubmit} size="lg" className="w-full h-11 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold shadow-sm shrink-0 touch-manipulation">
                Submit
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 py-2 my-auto"
          >
            <div className={`p-4 sm:p-5 rounded-full ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {isCorrect ? <Check className="w-12 h-12 sm:w-16 sm:h-16" /> : <X className="w-12 h-12 sm:w-16 sm:h-16" />}
            </div>
            
            <div className="text-center space-y-1 sm:space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {isCorrect ? "Correct!" : "Incorrect"}
              </h2>
              {!isCorrect && (
                <div className="flex flex-col items-center gap-1 mt-1 sm:mt-2 text-muted-foreground text-base sm:text-lg">
                  <p>Your answer: <span className="font-medium text-slate-800">{inputValue || "None"}</span></p>
                  <p>Correct answer: <span className="font-medium text-slate-800">{equation.answer}</span></p>
                  <p className="text-xs sm:text-sm mt-1 bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium">
                    Off by {Math.abs(equation.answer - (parseInt(inputValue, 10) || 0))}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-medium bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              {(timeTaken / 1000).toFixed(2)} seconds
            </div>

            <div className="w-full max-w-xs space-y-2.5 mt-2 sm:mt-4">
              <Button onClick={() => {
                setEquation(generateEquation(operationsRange))
                setInputValue("")
                setFinished(false)
                setStartTime(Date.now())
              }} className="w-full h-11 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold">
                Play Again
              </Button>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full h-11 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl text-base sm:text-lg bg-transparent">
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
