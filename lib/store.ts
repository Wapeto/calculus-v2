import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RunHistory {
  id: string
  date: string
  timeMs: number // time taken in milliseconds
  isCorrect: boolean
  userAnswer: number | null
  correctAnswer: number
  equation: string
}

interface CalculusState {
  operationsRange: [number, number]
  setOperationsRange: (range: [number, number]) => void
  history: RunHistory[]
  addRun: (run: RunHistory) => void
  clearHistory: () => void
}

export const useStore = create<CalculusState>()(
  persist(
    (set) => ({
      operationsRange: [6, 9],
      setOperationsRange: (range) => set({ operationsRange: range }),
      history: [],
      addRun: (run) => set((state) => ({ history: [...state.history, run] })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'calculus-storage',
    }
  )
)
