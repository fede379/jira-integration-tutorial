import { Form, GetRef } from "antd";
import { JiraIssue } from "../../interfaces/jira.responses";

export interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof JiraIssue;
  record: JiraIssue;
  handleSave: (record: JiraIssue) => void;
}

export type FormInstance<T> = GetRef<typeof Form<T>>;
