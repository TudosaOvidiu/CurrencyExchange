import { Card, List } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { Transaction } from "./useTransactions";
import classes from "./TransactionList.module.css";

import React from "react";

interface TransactionListProps {
  transactions: Record<string, Transaction[]>;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <>
      {Object.entries(transactions).map(([date, transactionList]) => (
        <div key={date}>
          <p className={classes.date}>{date}</p>
          <Card>
            <List
              dataSource={transactionList}
              renderItem={({ title, date, exchangedCurrencies }) => (
                <List.Item className={classes.listItem}>
                  <div className={classes.iconContainer}>
                    <SyncOutlined style={{ fontSize: "24px" }} />
                  </div>

                  <div>
                    <p className={classes.bold}>{title}</p>
                    <p className={classes.smallGrayText}>
                      {date.getHours()}:{date.getMinutes()}
                    </p>
                  </div>

                  <div className={classes.currencyContainer}>
                    <p>
                      -{exchangedCurrencies.base.amount}
                      {exchangedCurrencies.base.name}
                    </p>
                    <p className={classes.smallGrayText}>
                      +{exchangedCurrencies.bought.amount}
                      {exchangedCurrencies.bought.name}
                    </p>
                  </div>
                </List.Item>
              )}
            ></List>
          </Card>
        </div>
      ))}
    </>
  );
};

export default React.memo(TransactionList);

