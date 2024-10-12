import React, { useState } from "react";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Flex, Layout, Menu, MenuProps, theme, Typography } from "antd";
import { Link, Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import { clearLocalStorage } from "../../utils/storage";
import capitalize from "lodash/capitalize";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const items = [
  {
    key: "issues",
    icon: React.createElement(HomeOutlined),
    label: "Issues",
  },
  {
    key: "logout",
    icon: React.createElement(LogoutOutlined),
    label: "Logout",
  },
];

type NavKey = "issues" | "workspaces" | "logout";

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
};

export function RootPage() {
  const [currentNavKey, setCurrentNavKey] = useState<NavKey>("issues");
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onClick: MenuProps["onClick"] = (e) => {
    const navKey = e.key as NavKey;
    setCurrentNavKey(navKey);
    if (navKey === "logout") {
      clearLocalStorage();
      return navigate("login", { replace: true });
    }
    return navigate(e.key);
  };

  return (
    <Layout hasSider>
      <Sider breakpoint="lg" collapsedWidth="0" style={siderStyle}>
        <Flex
          gap="middle"
          vertical
          align="center"
          justify="center"
          style={{ height: 40 }}
        >
          <Link to="/issues" style={{ color: "white", fontSize: 18 }}>
            Jira integration app
          </Link>
        </Flex>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[currentNavKey]}
          onClick={onClick}
          items={items}
        />
      </Sider>
      <Layout style={{ marginInlineStart: 200 }}>
        <Header
          style={{
            margin: "0 16px",
            paddingLeft: 24,
            background: colorBgContainer,
          }}
        >
          <Flex
            vertical
            gap="middle"
            justify="center"
            style={{ height: "100%" }}
          >
            <Title level={2}>{capitalize(currentNavKey)}</Title>
          </Flex>
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              height: "calc(100vh - 164px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: "auto",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Jira integration workshop
        </Footer>
      </Layout>
      <ScrollRestoration />
    </Layout>
  );
}
