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
  operationsCount: number
  setOperationsCount: (count: number) => void
  history: RunHistory[]
  addRun: (run: RunHistory) => void
}

export const useStore = create<CalculusState>()(
  persist(
    (set) => ({
      operationsCount: 6,
      setOperationsCount: (count) => set({ operationsCount: count }),
      history: [],
      addRun: (run) => set((state) => ({ history: [...state.history, run] })),
    }),
    {
      name: 'calculus-storage',
    }
  )
)
