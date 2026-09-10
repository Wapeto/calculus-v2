export interface Equation {
  expression: string;
  answer: number;
}

export function generateEquation(operationsRange: [number, number]): Equation {
  const operationsCount = Math.floor(Math.random() * (operationsRange[1] - operationsRange[0] + 1)) + operationsRange[0];

  // random true/false to include a 999 number
  const includeBigNumber = Math.random() > 0.5;
  const bigNumberIndex = includeBigNumber ? Math.floor(Math.random() * (operationsCount + 1)) : -1;

  let currentTotal = 0;
  let expression = "";

  for (let i = 0; i < operationsCount; i++) {
    // Determine the magnitude of the number
    const maxVal = i === bigNumberIndex ? 999 : 99;
    
    // Generate a number between 0 and maxVal
    const absVal = Math.floor(Math.random() * (maxVal + 1));
    
    // Determine operation (add or subtract)
    const isAdd = Math.random() > 0.5;

    if (isAdd) {
      currentTotal += absVal;
      expression += (i === 0 ? "" : " ") + `+ ${absVal}`;
    } else {
      currentTotal -= absVal;
      expression += (i === 0 ? "" : " ") + `- ${absVal}`;
    }
  }

  return {
    expression,
    answer: currentTotal,
  };
}
