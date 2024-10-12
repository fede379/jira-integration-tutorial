import "./issues.css";
import {
  Avatar,
  Button,
  Flex,
  Popconfirm,
  Select,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useJiraApi } from "../../hooks/useJiraApi";
import { useState } from "react";
import {
  JiraIssue,
  JiraProject,
  PaginatedResponse,
} from "../../interfaces/jira.responses";
import useSWR from "swr";
import { EditableCell, EditableRow } from "./components";

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
  const { fetcher, deleteJiraIssue, updateJiraIssueSummary } = useJiraApi();

  const { data: jiraProjects } = useSWR(
    { url: "/project" },
    fetcher<JiraProject[]>
  );
  const { data: jiraIssues, mutate: mutateJiraIssues } = useSWR(
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

  function onDeleteIssue(id: string) {
    return async () => {
      if (jiraIssues) {
        const filteredIssues = {
          ...jiraIssues,
          issues: jiraIssues.issues?.filter((issue) => issue.id !== id) || [],
        };
        const deleteIssue = async () => {
          try {
            await deleteJiraIssue(id);
            return filteredIssues;
          } catch (error) {
            console.log(error);
          }
        };
        mutateJiraIssues(deleteIssue(), {
          optimisticData: filteredIssues,
          rollbackOnError: true,
        });
      }
    };
  }

  function onUpdateIssueSummary(record: JiraIssue) {
    try {
      if (jiraIssues) {
        const index = jiraIssues.issues?.findIndex(
          (item) => item.id === record.id
        );
        const item = jiraIssues.issues[index];
        const issues = jiraIssues.issues.map((issue) =>
          issue.id === record.id ? { ...item, ...record } : issue
        );
        const updatedJiraIssues = { ...jiraIssues, issues };

        const updateJiraIssue = async () => {
          try {
            await updateJiraIssueSummary(record.id, record.fields.summary);
            return updatedJiraIssues;
          } catch (error) {
            console.log(error);
          }
        };

        mutateJiraIssues(updateJiraIssue(), {
          optimisticData: updatedJiraIssues,
          rollbackOnError: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleSave(record: JiraIssue) {
    onUpdateIssueSummary(record);
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
      onCell: (record: JiraIssue) => ({
        record,
        editable: true,
        dataIndex: ["fields", "summary"],
        title: "Summary",
        handleSave,
      }),
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
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, row) => {
        return (
          <Flex align="center" gap={8}>
            <Popconfirm
              title="Delete the issue"
              description="Are you sure to delete this issue?"
              onConfirm={onDeleteIssue(row.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
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
      <Table<JiraIssue>
        dataSource={jiraIssues?.issues}
        columns={columns}
        bordered
        rowClassName={() => "editable-row"}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
      />
    </Flex>
  );
}
