import React from "react";
import { Currency } from "./useExchangePanel";
import ExchangeCard from "./ExchangeCard";
import { roundTo2Decimals } from "../utils";

interface ExchangePanelProps {
  balances: Record<string, number>;
  baseCurrencyName: string;
  buyCurrency: Currency;
  currencies: string[];
  handleBaseAmountInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBaseCurrencySelect: (currencyName: string) => void;
  handleBuyingAmountInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCurrencySelection: (currencyName: string) => void;
  inputValues: {
    baseAmount: string;
    buyingAmount: string;
  };
  isBalanceExceeded: boolean;
  rates: Record<string, number>;
  setIsBuyingInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExchangePanel: React.FC<ExchangePanelProps> = ({
  baseCurrencyName,
  balances,
  inputValues,
  handleBaseAmountInput,
  handleBaseCurrencySelect,
  handleBuyingAmountInput,
  handleCurrencySelection,
  buyCurrency,
  currencies,
  rates,
  isBalanceExceeded,
  setIsBuyingInputFocused,
}) => {
  return (
    <>
      <ExchangeCard
        balance={roundTo2Decimals(balances[baseCurrencyName] || 0)}
        handleInputChange={handleBaseAmountInput}
        handleSelect={handleBaseCurrencySelect}
        inputValue={inputValues.baseAmount}
        options={currencies}
        selectedCurrency={baseCurrencyName}
        isBalanceExceeded={isBalanceExceeded}
      />

      <ExchangeCard
        balance={roundTo2Decimals(balances[buyCurrency.name] || 0)}
        handleInputChange={handleBuyingAmountInput}
        handleSelect={handleCurrencySelection}
        inputValue={inputValues.buyingAmount}
        options={Object.keys(rates)}
        selectedCurrency={buyCurrency.name}
        handleInputBlur={() => setIsBuyingInputFocused(false)}
        handleInputFocus={() => setIsBuyingInputFocused(true)}
      />
    </>
  );
};

export default ExchangePanel;
