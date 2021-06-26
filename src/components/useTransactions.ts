import { useState } from "react";
import { months } from "../utils";
import { Currency, InputValues } from "./useExchangePanel";

export type Balances = Record<string, number>;

export interface Transaction {
  title: string;
  date: Date;
  exchangedCurrencies: {
    base: Currency;
    bought: Currency;
  };
}

interface UseTransactionProps {
  balances: Balances;
  baseCurrencyName: string;
  buyCurrency: Currency;
  inputValues: InputValues;
  setBalances: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

interface UseTransactionReturn {
  onExchange: () => void;
  transactions: Record<string, Transaction[]>;
}

type UseTransactionHook = (props: UseTransactionProps) => UseTransactionReturn;

const useTransactions: UseTransactionHook = ({
  balances,
  setBalances,
  baseCurrencyName,
  buyCurrency,
  inputValues,
}) => {
  const [transactions, setTransactions] = useState<
    Record<string, Transaction[]>
  >({});

  const updateBalances = (transaction: Transaction) => {
    const {
      exchangedCurrencies: { base, bought },
    } = transaction;
    const baseBalance = balances[base.name] - base.amount!;
    const boughtCurrencyBalance = (balances[bought.name] || 0) + bought.amount!;
    setBalances({
      ...balances,
      [base.name]: baseBalance,
      [bought.name]: boughtCurrencyBalance,
    });
  };

  const onExchange = () => {
    const date = new Date();
    const transactionKey: string = `${date.getDate()} ${
      months[date.getMonth()]
    }`;

    const transactionsForDate = transactions[transactionKey] || [];
    const newTransaction = {
      title: `Sold ${baseCurrencyName} for ${buyCurrency.name}`,
      exchangedCurrencies: {
        base: {
          name: baseCurrencyName,
          amount: parseFloat(inputValues.baseAmount),
        },
        bought: {
          name: buyCurrency.name,
          amount: parseFloat(inputValues.buyingAmount),
        },
      },
      date,
    };

    transactionsForDate.push(newTransaction);

    updateBalances(newTransaction);

    setTransactions({ ...transactions, [transactionKey]: transactionsForDate });
  };

  return {
    onExchange,
    transactions,
  };
};

export default useTransactions;
