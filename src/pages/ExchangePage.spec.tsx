import React from "react";
import "@testing-library/jest-dom";
import ExchangePage from "./ExchangePage";
import { findByText, render, screen } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import { generateExchangeRateForBase, roundTo2Decimals } from "../utils/index";

Object.defineProperty(window, "matchMedia", {
  value: () => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    };
  },
});

jest.mock("axios");

const payload = { data: { rates: { BSD: 1.0, EUR: 0.84, GBP: 0.72 } } };
const rates = payload.data.rates;
describe("Before data fetching", () => {
  it("Should show spinner until data is retrieved", async () => {
    render(<ExchangePage />);
    const spinnerSpan = screen.getByLabelText("loading");
    expect(spinnerSpan).toBeInTheDocument();
  });
});

describe("After data fetching", () => {
  beforeEach(() => {
    axios.get.mockImplementationOnce(() => Promise.resolve(payload));
  });

  it("Should display exchange components and hide spinner", async () => {
    render(<ExchangePage />);
    expect(await screen.findByText(/Market order/)).toBeInTheDocument();
    expect(screen.queryByLabelText("loading")).toBeNull();
  });

  it("Initial data to be in place", async () => {
    render(<ExchangePage />);

    expect(
      await screen.findByText("Market order 1USD = 0.84EUR")
    ).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("EUR")).toBeInTheDocument();
    expect(screen.getByText("Balance: 500")).toBeInTheDocument();
    expect(screen.getByText("Balance: 400")).toBeInTheDocument();
  });

  describe("Input validation", () => {
    it("Should trim base input value to 2 decimals", async () => {
      render(<ExchangePage />);
      const [baseInput] = await screen.findAllByPlaceholderText("0");

      await userEvent.type(baseInput, "22.333");
      expect(baseInput.value).toEqual("22.33");
    });

    it("Should trim buying input value to 2 decimals", async () => {
      render(<ExchangePage />);
      const [baseInput, buyingInput] = await screen.findAllByPlaceholderText(
        "0"
      );

      await userEvent.type(buyingInput, "420.699999");
      expect(buyingInput.value).toEqual("420.69");
    });

    it("Should allow only digits and '.'", async () => {
      render(<ExchangePage />);
      const [baseInput] = await screen.findAllByPlaceholderText("0");

      await userEvent.type(baseInput, "22a");
      expect(baseInput.value).toEqual("22");
      await userEvent.type(baseInput, ",");
      expect(baseInput.value).toEqual("22");
      await userEvent.type(baseInput, "!");
      expect(baseInput.value).toEqual("22");
      await userEvent.type(baseInput, ".6");
      expect(baseInput.value).toEqual("22.6");
    });

    it("Should fill input for buying currency with proper amount when base currency amount is changed ", async () => {
      render(<ExchangePage />);
      const baseAmount = 42;
      const [baseInput, buyingInput] = await screen.findAllByPlaceholderText(
        "0"
      );

      await userEvent.type(baseInput, baseAmount.toString());
      const buyAmount = roundTo2Decimals(baseAmount * rates.EUR);
      expect(buyingInput.value).toEqual(buyAmount.toString().replace(",", "."));
    });

    it("Should fill input for base currency with proper amount when buying currency amount is changed ", async () => {
      render(<ExchangePage />);
      const buyingAmount = 42;
      const [baseInput, buyingInput] = await screen.findAllByPlaceholderText(
        "0"
      );

      await userEvent.type(buyingInput, buyingAmount.toString());
      const baseAmount = roundTo2Decimals(buyingAmount / rates.EUR);
      expect(baseInput.value).toEqual(baseAmount.toString().replace(",", "."));
    });

    it("Should reset inputs when base currency is changed", async () => {
      const newBaseCurrency = "GBP";
      const selectedCurrency = "USD";
      render(<ExchangePage />);

      const [baseInput, buyingInput] = await screen.findAllByPlaceholderText(
        "0"
      );

      await userEvent.type(baseInput, "420.699999");
      expect(baseInput.value).toEqual("420.69");

      const baseCurrencySelect = await screen.findByText(selectedCurrency);
      userEvent.click(baseCurrencySelect);
      const gbpOption = await screen.findByText(newBaseCurrency);
      userEvent.click(gbpOption);

      expect(baseInput.value).toEqual("0");
      expect(buyingInput.value).toEqual("0");
    });

    it("Should reset inputs when buying currency is changed", async () => {
      const newBaseCurrency = "GBP";
      const selectedCurrency = "EUR";
      render(<ExchangePage />);

      const [baseInput, buyingInput] = await screen.findAllByPlaceholderText(
        "0"
      );

      await userEvent.type(baseInput, "420.699999");
      expect(baseInput.value).toEqual("420.69");

      const baseCurrencySelect = await screen.findByText(selectedCurrency);
      userEvent.click(baseCurrencySelect);
      const gbpOption = await screen.findByText(newBaseCurrency);
      userEvent.click(gbpOption);

      expect(baseInput.value).toEqual("0");
      expect(buyingInput.value).toEqual("0");
    });
  });

  describe("App validation", () => {
    it("Should update market order info when currency is changed", async () => {
      const newBaseCurrency = "GBP";
      const selectedCurrency = "USD";
      render(<ExchangePage />);

      const baseCurrencySelect = await screen.findByText(selectedCurrency);
      userEvent.click(baseCurrencySelect);
      const gbpOption = await screen.findByText(newBaseCurrency);
      userEvent.click(gbpOption);

      const ratesForNewBase = generateExchangeRateForBase(
        newBaseCurrency,
        rates
      );

      expect(
        await screen.findByText(
          `Market order 1${newBaseCurrency} = ${ratesForNewBase.EUR}EUR`
        )
      ).toBeInTheDocument();
    });

    it("Should display error message if trying to buy with an amount larger than the balance", async () => {
      render(<ExchangePage />);

      const [baseInput] = await screen.findAllByPlaceholderText("0");

      await userEvent.type(baseInput, "600");
      expect(screen.getByText("exceeds balance")).toBeInTheDocument();
    });

    it("Should remove error message when balance is no longer exceeded", async () => {
      render(<ExchangePage />);

      const [baseInput] = await screen.findAllByPlaceholderText("0");

      await userEvent.type(baseInput, "600");
      expect(screen.getByText("exceeds balance")).toBeInTheDocument();

      baseInput.value = "0";

      await userEvent.type(baseInput, "300");
      expect(screen.queryByText("exceeds balance")).toBeNull();
    });

    it("Should disable exchange button if input amount is 0", async () => {
      render(<ExchangePage />);

      await screen.findByText(/Market order/);
      const exchangeButton = document.querySelector("button");
      expect(exchangeButton).toBeDisabled();
    });

    it("Should disable exchange button if amount exceeds balance", async () => {
      render(<ExchangePage />);

      const [baseInput] = await screen.findAllByPlaceholderText("0");

      await userEvent.type(baseInput, "600");
      const exchangeButton = document.querySelector("button");

      expect(exchangeButton).toBeDisabled();
    });

    it("Should create transaction after pressing exchange button", async () => {
      render(<ExchangePage />);

      const [baseInput] = await screen.findAllByPlaceholderText("0");
      await userEvent.type(baseInput, "300");

      const exchangeButton = document.querySelector("button");
      userEvent.click(exchangeButton!);

      await screen.findByText(/Market order/);
      const transactionList = document.querySelector(
        'ul[class="ant-list-items"]'
      );
      expect(transactionList).toBeInTheDocument();
    });

    it("Should update balances after the exchange has been made", async () => {
      let usdBalance = 500;
      let eurBalance = 400;
      const amountToExchange = 300;
      render(<ExchangePage />);

      const [baseInput] = await screen.findAllByPlaceholderText("0");
      await userEvent.type(baseInput, amountToExchange.toString());

      const exchangeButton = document.querySelector("button");
      userEvent.click(exchangeButton!);

      usdBalance = roundTo2Decimals(usdBalance - amountToExchange);
      eurBalance = roundTo2Decimals(eurBalance + amountToExchange * rates.EUR);

      expect(
        await screen.findByText(
          `Balance: ${usdBalance.toString().replace(",", ".")}`
        )
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          `Balance: ${eurBalance.toString().replace(",", ".")}`
        )
      ).toBeInTheDocument();
    });
  });
});
