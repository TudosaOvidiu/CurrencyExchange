import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";

interface FallbackProps {
  loading: boolean;
  children: any;
}

const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;

const Spinner = () => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Spin indicator={antIcon} />
  </div>
);

const Fallback: React.FC<FallbackProps> = ({ loading, children }) =>
  loading ? <Spinner /> : <>{children} </>;

export default Fallback;
