export interface Equation {
  expression: string;
  answer: number;
}

export function generateEquation(operationsCount: number): Equation {
  // random true/false to include a 999 number
  const includeBigNumber = Math.random() > 0.5;
  const bigNumberIndex = includeBigNumber ? Math.floor(Math.random() * (operationsCount + 1)) : -1;

  let currentTotal = 0;
  let expression = "";

  for (let i = 0; i <= operationsCount; i++) {
    // Determine the magnitude of the number
    const maxVal = i === bigNumberIndex ? 999 : 99;
    
    // Generate a number between 0 and maxVal
    const absVal = Math.floor(Math.random() * (maxVal + 1));
    
    // Determine sign
    const isNegative = Math.random() > 0.5;
    const val = isNegative ? -absVal : absVal;

    // Build the string representation
    const valStr = isNegative ? `(${val})` : `${val}`;

    if (i === 0) {
      currentTotal = val;
      expression = valStr;
    } else {
      // For subsequent numbers, we add them to the total.
      // E.g. we just use + for combining them, as requested: "45 + (-12)"
      // Or we can randomly choose addition or subtraction?
      // Wait, the user said "A single long equation (e.g. 45 - 12 + 99 = ?)", but also said "As explicit negative numbers in parentheses (e.g., 45 + (-12))".
      // This implies the operations are always addition of signed numbers, or maybe sometimes subtraction of signed numbers?
      // "it should only have + and - operations (at random)"
      const opIsAdd = Math.random() > 0.5;
      
      if (opIsAdd) {
        currentTotal += val;
        expression += ` + ${valStr}`;
      } else {
        currentTotal -= val;
        expression += ` - ${valStr}`;
      }
    }
  }

  return {
    expression,
    answer: currentTotal,
  };
}
