import React, { useState } from "react";
import ExchangeButton from "../components/ExchangeButton";
import ExchangeDetails from "../components/ExchangeDetails";
import ExchangePanel from "../components/ExchangePanel";
import Fallback from "../components/Fallback";
import TransactionList from "../components/TransactionList";
import useExchangePanel from "../components/useExchangePanel";
import useTransactions, { Balances } from "../components/useTransactions";

const ExchangePage = () => {
  const {
    baseCurrencyName,
    buyCurrency,
    currencies,
    onBaseBaseAmountInputChange,
    onBuyingAmountInputChange,
    inputValues,
    onBaseCurrencySelect,
    onCurrencySelect,
    rates,
    setIsBuyingInputFocused,
  } = useExchangePanel();

  const [balances, setBalances] = useState<Balances>({
    USD: 500,
    EUR: 400,
    GBP: 300,
  });

  const { onExchange, transactions } = useTransactions({
    balances,
    baseCurrencyName,
    buyCurrency,
    inputValues,
    setBalances,
  });

  const isBalanceExceeded =
    (balances[baseCurrencyName] || 0) - parseFloat(inputValues.baseAmount) < 0;

  return (
    <Fallback loading={currencies.length === 0}>
      <ExchangeDetails
        buyCurrency={buyCurrency}
        baseCurrencyName={baseCurrencyName}
      />

      <ExchangePanel
        balances={balances}
        baseCurrencyName={baseCurrencyName}
        buyCurrency={buyCurrency}
        currencies={currencies}
        handleBaseAmountInput={onBaseBaseAmountInputChange}
        handleBaseCurrencySelect={onBaseCurrencySelect}
        handleBuyingAmountInput={onBuyingAmountInputChange}
        handleCurrencySelection={onCurrencySelect}
        inputValues={inputValues}
        isBalanceExceeded={isBalanceExceeded}
        rates={rates}
        setIsBuyingInputFocused={setIsBuyingInputFocused}
      />

      <ExchangeButton
        isBalanceExceeded={isBalanceExceeded}
        inputValues={inputValues}
        onExchange={onExchange}
        baseCurrencyName={baseCurrencyName}
        buyCurrency={buyCurrency}
      />

      <TransactionList transactions={transactions} />
    </Fallback>
  );
};

export default ExchangePage;
