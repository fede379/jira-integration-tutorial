import { Avatar, Flex, Select, Table, TableProps, Typography } from "antd";
import { useJiraApi } from "../../hooks/useJiraApi";
import { useState } from "react";
import {
  JiraIssue,
  JiraProject,
  PaginatedResponse,
} from "../../interfaces/jira.responses";
import useSWR from "swr";

enum IssueType {
  Epic,
  Story,
}

function getJqlQuery(type: IssueType, projectId?: string): string {
  return `${
    projectId ? `project = ${projectId} and parent is empty` : "parent is empty"
  } ${
    type === IssueType.Epic ? "and issueType = Epic" : "and issueType != Epic"
  }`;
}

export function IssuesPage() {
  const [selectedProject, setSelectedProject] = useState<JiraProject>();
  const [selectedIssueType, setSelectedIssueType] = useState<IssueType>(
    IssueType.Story
  );
  const { fetcher } = useJiraApi();

  const { data: jiraProjects } = useSWR(
    { url: "/project" },
    fetcher<JiraProject[]>
  );
  const { data: jiraIssues } = useSWR(
    {
      url: "search",
      params: {
        jql: getJqlQuery(selectedIssueType, selectedProject?.id),
        maxResults: 100,
      },
    },
    fetcher<PaginatedResponse<JiraIssue, "issues">>
  );

  function onChangeJiraProject(value: string) {
    const selectedJiraProject = jiraProjects?.find((p) => p.id === value);
    if (selectedJiraProject) {
      setSelectedProject(selectedJiraProject);
    }
  }

  function onChangeIssueType(value: IssueType) {
    setSelectedIssueType(value);
  }

  const columns: TableProps<JiraIssue>["columns"] = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      render: (value: string, row: JiraIssue) => {
        return (
          <Flex align="center" gap={8}>
            <Avatar size="small" src={row.fields.issuetype.iconUrl} />
            <Typography.Text>{value}</Typography.Text>
          </Flex>
        );
      },
    },
    {
      title: "Summary",
      dataIndex: ["fields", "summary"],
      key: "summary",
    },
    {
      title: "Status",
      dataIndex: ["fields", "status", "name"],
      key: "status",
    },
    {
      title: "Priority",
      dataIndex: ["fields", "priority", "name"],
      key: "priority",
      render: (_, row: JiraIssue) => {
        return (
          <Flex align="center" gap={8}>
            <Avatar size="small" src={row.fields.priority.iconUrl} />
            <Typography.Text>{row.fields.priority.name}</Typography.Text>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex vertical gap={16}>
      <Flex gap={16} align="center">
        <Typography.Text>Filters</Typography.Text>
        <Select
          placeholder="Filter by Jira Project"
          value={selectedProject?.id}
          options={jiraProjects?.map((p) => ({ value: p.id, label: p.name }))}
          onChange={onChangeJiraProject}
        />
        <Select
          placeholder="Filter by Issue Type"
          value={selectedIssueType}
          options={[
            { value: IssueType.Epic, label: "Epic" },
            { value: IssueType.Story, label: "Story" },
          ]}
          onChange={onChangeIssueType}
        />
      </Flex>
      <Table dataSource={jiraIssues?.issues} columns={columns} />
    </Flex>
  );
}
