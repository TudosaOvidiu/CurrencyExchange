const roundTo2Decimals = (num: number) => Math.round(num * 100) / 100;

const generateExchangeRateForBase = (
  newBase: string,
  ratesUSDBase: Record<string, number>
) => {
  if (newBase === "USD") {
    return ratesUSDBase;
  }

  const amountInUSDForOneUnit = 1 / ratesUSDBase[newBase];
  const newRates: Record<string, number> = Object.entries(ratesUSDBase).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value * amountInUSDForOneUnit,
    }),
    { USD: amountInUSDForOneUnit }
  );
  delete newRates[newBase];
  return newRates;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export { generateExchangeRateForBase, roundTo2Decimals, months };
