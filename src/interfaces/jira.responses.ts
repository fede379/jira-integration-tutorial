export interface JiraResource {
  id: string;
  name: string;
  url: string;
  scopes: string[];
  avatarUrl: string;
}

export interface JiraAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  error?: unknown;
}

export interface JiraProject {
  self: string;
  id: string;
  key: string;
  name: string;
  avatarUrls: {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
  };
  projectCategory: {
    self: string;
    id: string;
    name: string;
    description: string;
  };
  simplified: boolean;
  style: string;
  insight: {
    totalIssueCount: number;
    lastIssueUpdateTime: string;
  };
}

export interface JiraPriority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

export interface JiraFieldMetadata {
  id?: string;
  required: boolean;
  schema: {
    type: string;
    system: string;
    items?: string;
  };
  name: string;
  key: string;
  hasDefaultValue: boolean;
  operations: string[];
  allowedValues: {
    id: string;
    iconUrl?: string;
    name?: string;
    value?: string;
  }[];
}

export interface JiraIssueType {
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  fields: { [key: string]: JiraFieldMetadata };
}

export interface JiraStatus {
  description: string;
  id: string;
  name: string;
  iconUrl: string;
  scope: {
    project: {
      id: string;
    };
    type: string;
  };
  statusCategory: { id: number; key: string; colorName: string; name: string };
  usages: {
    issueTypes: string[];
    project: {
      id: string;
    };
  }[];
  workflowUsages: {
    workflowId: string;
    workflowName: string;
  }[];
}

export interface JiraIssue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    statuscategorychangedate: string;
    summary: string;
    issuetype: JiraIssueType;
    project: JiraProject;
    priority: JiraPriority;
    status: JiraStatus;
    created: string;
    updated: string;
  };
}

export type PaginatedResponse<T, K extends string = "values"> = {
  [P in K]: T[];
} & {
  self: string;
  nextPage: string;
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
};
