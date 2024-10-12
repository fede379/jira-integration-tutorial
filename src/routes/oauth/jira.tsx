import { Button, Card, Flex, Select, Typography } from "antd";
import { useJiraAuth } from "../../hooks/useJiraAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  saveCloudIdIntoLocalStorage,
  saveJiraTokenIntoLocalStorage,
} from "../../utils/storage";
import { useState } from "react";
import { useJiraApi } from "../../hooks/useJiraApi";
import { JiraResource } from "../../interfaces/jira.responses";

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

enum Step {
  Authorization,
  GetResources,
  ResourceSelection,
}

export function JiraOauthPage() {
  const [step, setStep] = useState<Step>(Step.Authorization);
  const [resources, setResources] = useState<JiraResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<JiraResource>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { getJiraAccessToken } = useJiraAuth();
  const { getJiraResources } = useJiraApi();

  async function onRequestAccessToken() {
    const code = Object.fromEntries(params)["code"];
    if (code) {
      try {
        const authResponse = await getJiraAccessToken(code);
        saveJiraTokenIntoLocalStorage(authResponse.access_token);
        setStep(Step.GetResources);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function onRequestAvailableResources() {
    try {
      setStep(Step.ResourceSelection);
      const jiraResources = await getJiraResources();
      setResources(jiraResources);
    } catch (error) {
      console.error(error);
    }
  }

  async function onChangeResource(value: string) {
    const selectedJiraResource = resources.find((r) => r.id === value);
    if (selectedJiraResource) {
      setSelectedResource(selectedJiraResource);
    }
  }

  async function onSubmit() {
    if (selectedResource) {
      saveCloudIdIntoLocalStorage(selectedResource.id);
      navigate("/issues");
    }
  }

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
                <Button
                  disabled={step > Step.Authorization}
                  type="primary"
                  onClick={onRequestAccessToken}
                >
                  Request Access Token
                </Button>
              </Flex>
            </Flex>
          </Card>
          {step > Step.Authorization && (
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
                    Paso 3. Solicitar los Resources disponibles para posterior
                    seleccion del usuario
                  </Typography.Title>
                  <Button
                    disabled={step > Step.GetResources}
                    type="primary"
                    onClick={onRequestAvailableResources}
                  >
                    Request Available Resources
                  </Button>
                </Flex>
              </Flex>
            </Card>
          )}
          {step > Step.GetResources && (
            <Card
              hoverable
              style={cardStyle}
              styles={{ body: { padding: 0, overflow: "hidden" } }}
            >
              <Flex justify="space-between">
                <img alt="avatar" src="/jira.jpeg" style={imgStyle} />
                <Flex
                  vertical
                  gap={8}
                  align="flex-end"
                  justify="space-between"
                  style={{ padding: 32 }}
                >
                  <Typography.Title level={3}>
                    Paso 4. Seleccion del Jira Resource
                  </Typography.Title>
                  <Select
                    value={selectedResource?.id}
                    onChange={onChangeResource}
                    placeholder="Select a resource"
                    options={resources.map((r) => ({
                      value: r.id,
                      label: <span>{r.name}</span>,
                    }))}
                  />
                  <Button type="primary" onClick={onSubmit}>
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </Card>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
