import { Button } from "antd";
import React from "react";
import { Currency, InputValues } from "./useExchangePanel";
import classes from "./ExchangeButton.module.css";

interface ExchangeButtonProps {
  isBalanceExceeded: boolean;
  inputValues: InputValues;
  onExchange: () => void;
  baseCurrencyName: string;
  buyCurrency: Currency;
}

const ExchangeButton: React.FC<ExchangeButtonProps> = ({
  isBalanceExceeded,
  inputValues,
  onExchange,
  baseCurrencyName,
  buyCurrency,
}) => {
  const isDisabled =
    isBalanceExceeded ||
    (parseFloat(inputValues.baseAmount) === 0 &&
      parseFloat(inputValues.buyingAmount) === 0);

  return (
    <div className={classes.buttonContainer}>
      <Button
        type="primary"
        className={classes.button}
        disabled={isDisabled}
        onClick={onExchange}
      >
        Sell {baseCurrencyName} for {buyCurrency.name}
      </Button>
    </div>
  );
};

export default ExchangeButton;
