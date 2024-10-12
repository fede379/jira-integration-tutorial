import { FormInstance } from "antd";
import { createContext } from "react";
import { JiraIssue } from "../../../interfaces/jira.responses";

export const EditableContext = createContext<FormInstance<JiraIssue> | null>(
  null
);
