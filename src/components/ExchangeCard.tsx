import React from "react";
import { Card, Col, Input, Row, Select } from "antd";
import classes from "./ExchangeCard.module.css";

const { Option } = Select;

interface ExchangeCardProps {
  selectedCurrency: string;
  options: string[];
  balance: number;
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (selection: string) => void;
  isBalanceExceeded?: boolean;
  handleInputBlur?: () => void;
  handleInputFocus?: () => void;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({
  selectedCurrency,
  options,
  balance,
  inputValue,
  handleInputChange,
  handleSelect,
  isBalanceExceeded = false,
  handleInputBlur = () => {},
  handleInputFocus = () => {},
}) => {
  return (
    <Card className={classes.card}>
      <Row className={classes.contentContainer}>
        <Col span={12}>
          <Select
            showSearch
            className={classes.select}
            value={selectedCurrency}
            onChange={handleSelect}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {options.map((op) => (
              <Option key={op} value={op}>
                {op}
              </Option>
            ))}
          </Select>
          <p className={classes.greyText}>Balance: {balance}</p>
        </Col>

        <Col span={10} className={classes.inputContainer}>
          <Input
            className={classes.input}
            type="text"
            placeholder={"0"}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {isBalanceExceeded && (
            <p className={classes.error}>exceeds balance</p>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default ExchangeCard;
