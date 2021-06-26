import React from "react";
import "./App.css";
import { Col, Row } from "antd";
import ExchangePage from "./pages/ExchangePage";

function App() {
  return (
    <Row justify="center">
      <Col xs={20} sm={16} md={12} lg={10} xl={8} xxl={6}>
        <ExchangePage />
      </Col>
    </Row>
  );
}

export default App;
