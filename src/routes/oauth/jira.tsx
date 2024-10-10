import { Button, Card, Flex, Typography } from "antd";

const cardStyle: React.CSSProperties = {
  maxHeight: 269,
};

const imgStyle: React.CSSProperties = {
  display: "block",
  width: 250,
  objectFit: "contain",
};

const rootStyle: React.CSSProperties = {
  height: "100vh",
  width: "100vw",
  overflow: "auto",
  padding: "80px 0",
};

export function JiraOauthPage() {
  function onRequestAccessToken() {}

  return (
    <Flex vertical align="center" style={rootStyle}>
      <Flex style={{ padding: 24, width: 800 }}>
        <Flex vertical wrap="nowrap" style={{ gap: 16 }}>
          <Card
            hoverable
            style={cardStyle}
            styles={{ body: { padding: 0, overflow: "hidden" } }}
          >
            <Flex justify="space-between">
              <img alt="avatar" src="/jira.jpeg" style={imgStyle} />
              <Flex
                vertical
                align="flex-end"
                justify="space-between"
                style={{ padding: 32 }}
              >
                <Typography.Title level={3}>
                  Paso 2. Utilizar Authorization code para solicitar un Access
                  Token
                </Typography.Title>
                <Button type="primary" onClick={onRequestAccessToken}>
                  Request Access Token
                </Button>
              </Flex>
            </Flex>
          </Card>
          {/* <Card
            hoverable
            style={cardStyle}
            styles={{ body: { padding: 0, overflow: "hidden" } }}
          >
            <Flex justify="space-between">
              <img alt="avatar" src="jira.jpeg" style={imgStyle} />
              <Flex
                vertical
                align="flex-end"
                justify="space-between"
                style={{ padding: 32 }}
              >
                <Typography.Title level={3}>
                  Paso 2. Utilizar Authorization code para solicitar un Access
                  Token
                </Typography.Title>
                <Button type="primary" onClick={onRequestAccessToken}>
                  Request Access Token
                </Button>
              </Flex>
            </Flex>
          </Card> */}
        </Flex>
      </Flex>
    </Flex>
  );
}
