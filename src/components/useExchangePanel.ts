import { useEffect, useState } from "react";
import { generateExchangeRateForBase, roundTo2Decimals } from "../utils";
import axios from "axios";
import { useInterval } from "../utils/useInterval";

export interface Currency {
  name: string;
  value?: number;
  amount?: number;
}

export type InputValues = {
  baseAmount: string;
  buyingAmount: string;
};

interface UseExchangePanelReturn {
  baseCurrencyName: string;
  buyCurrency: Currency;
  currencies: string[];
  inputValues: InputValues;
  onBaseBaseAmountInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBaseCurrencySelect: (currencyName: string) => void;
  onBuyingAmountInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCurrencySelect: (currencyName: string) => void;
  rates: Record<string, number>;
  setIsBuyingInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

type UseExchangePanelHook = () => UseExchangePanelReturn;

const doubleDigitRegex = /^\d*(\.\d{0,2})?$/;

const getInputToDisplay = (inputValue: string) => {
  let displayValue = inputValue;

  if (inputValue.length > 1 && inputValue[0] === "0" && inputValue[1] !== ".") {
    displayValue = inputValue.substring(1);
  }
  if (inputValue.slice(-1) === ".") {
    displayValue = inputValue;
  }
  return displayValue;
};

const useExchangePanel: UseExchangePanelHook = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [initialRates, setInitialRates] = useState<Record<string, number>>({});
  const [rates, setRates] = useState<Record<string, number>>({});
  const [baseCurrencyName, setBaseCurrencyName] = useState<string>("USD");
  const [buyCurrency, setBuyCurrency] = useState<Currency>({
    name: "EUR",
    value: 0,
  });
  const [inputValues, setInputValues] = useState({
    baseAmount: "0",
    buyingAmount: "0",
  });
  const [isBuyingInputFocused, setIsBuyingInputFocused] = useState(false);

  const updateInputValueOnRefetch = (rate: Record<string, number>) => {
    if (isBuyingInputFocused) {
      const buyingAmount = parseFloat(inputValues.buyingAmount);
      const baseAmount = roundTo2Decimals(
        buyingAmount / rate[buyCurrency.name]
      );
      setInputValues((prev) => ({
        baseAmount: baseAmount.toString().replace(",", "."),
        buyingAmount: prev.buyingAmount,
      }));
      return;
    }

    const baseAmount = parseFloat(inputValues.baseAmount);
    const buyingAmount = roundTo2Decimals(baseAmount * rate[buyCurrency.name]);
    setInputValues((prev) => ({
      baseAmount: prev.baseAmount,
      buyingAmount: buyingAmount.toString().replace(",", "."),
    }));
  };

  const updateUIOnFetch = (newRates: Record<string, number>) => {
    setInitialRates(newRates);

    const ratesForNewBase = generateExchangeRateForBase(
      baseCurrencyName,
      newRates
    );
    setRates(ratesForNewBase);

    setBuyCurrency({
      name: buyCurrency.name,
      value: ratesForNewBase[buyCurrency.name],
    });
    updateInputValueOnRefetch(ratesForNewBase);

    setCurrencies(["USD", ...Object.keys(newRates)]);
  };

  const refreshApp = async () => {
    try {
      const {
        data: { rates },
      } = await axios.get(
        `https://api.currencyfreaks.com/latest?apikey=${process.env.REACT_APP_API_KEY}`
      );
      updateUIOnFetch(rates);
    } catch (err) {}
  };

  useEffect(() => {
    refreshApp();
  }, []);

  useInterval(() => {
    refreshApp();
  }, 10000);

  const onBaseBaseAmountInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputValue = e.target.value;

    if (inputValue.length === 0) {
      setInputValues({
        baseAmount: "0",
        buyingAmount: "0",
      });
      return;
    }

    if (!doubleDigitRegex.test(inputValue)) return;

    const baseAmount = parseFloat(inputValue);
    const buyingAmount = roundTo2Decimals(baseAmount * buyCurrency.value!);

    const baseAmountStringified = getInputToDisplay(inputValue);

    setInputValues({
      baseAmount: baseAmountStringified,
      buyingAmount: buyingAmount.toString().replace(",", "."),
    });
  };

  const onBuyingAmountInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputValue = e.target.value;

    if (inputValue.length === 0) {
      setInputValues({
        baseAmount: "0",
        buyingAmount: "0",
      });
      return;
    }

    if (!doubleDigitRegex.test(inputValue)) return;

    const buyingAmount = parseFloat(inputValue);
    const baseAmount = roundTo2Decimals(buyingAmount / buyCurrency.value!);

    const buyingAmountStringified = getInputToDisplay(inputValue);

    setInputValues({
      baseAmount: baseAmount.toString().replace(",", "."),
      buyingAmount: buyingAmountStringified,
    });
  };

  const onCurrencySelect = (currencyName: string) => {
    setBuyCurrency({
      name: currencyName,
      value: rates[currencyName],
    });
    setInputValues({ baseAmount: "0", buyingAmount: "0" });
  };

  const onBaseCurrencySelect = (currencyName: string) => {
    const ratesForNewBase = generateExchangeRateForBase(
      currencyName,
      initialRates
    );

    if (currencyName === buyCurrency.name) {
      setBuyCurrency({
        name: baseCurrencyName,
        value: ratesForNewBase[baseCurrencyName],
      });
    } else {
      setBuyCurrency({
        name: buyCurrency.name,
        value: ratesForNewBase[buyCurrency.name],
      });
    }

    setBaseCurrencyName(currencyName);
    setInputValues({ baseAmount: "0", buyingAmount: "0" });
    setRates(ratesForNewBase);
  };

  return {
    baseCurrencyName,
    currencies,
    inputValues,
    onBaseBaseAmountInputChange,
    onBaseCurrencySelect,
    onBuyingAmountInputChange,
    onCurrencySelect,
    rates,
    buyCurrency,
    setIsBuyingInputFocused,
  };
};

export default useExchangePanel;

