import { Button, Card, Flex, Typography } from "antd";
import { getJiraConsentUrl } from "../../utils/jira";

const cardStyle: React.CSSProperties = {
  width: 800,
  maxHeight: 269,
};

const imgStyle: React.CSSProperties = {
  display: "block",
  width: 250,
  objectFit: "contain",
};

export function LoginPage() {
  return (
    <Flex vertical justify="center" align="center" style={{ height: "100vh" }}>
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
            <Typography.Title level={3}>Paso 1. Conectar con Jira</Typography.Title>
            <Button type="primary" href={getJiraConsentUrl()} target="_blank">
              Login
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
