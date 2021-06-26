import React from "react";
import { Currency } from "./useExchangePanel";
import classes from "./ExchangeDetails.module.css";

interface ExchangeDetailsProps {
  buyCurrency: Currency;
  baseCurrencyName: string;
}

const ExchangeDetails: React.FC<ExchangeDetailsProps> = ({
  buyCurrency,
  baseCurrencyName,
}) => {
  return (
    <div className={classes.detailsContainer}>
      <h1>Buy {buyCurrency?.name}</h1>
      <p className={classes.textColor}>
        Market order 1{baseCurrencyName} = {buyCurrency.value}
        {buyCurrency?.name}
      </p>
    </div>
  );
};

export default ExchangeDetails;
