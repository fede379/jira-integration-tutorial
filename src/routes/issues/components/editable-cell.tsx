import {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { JiraIssue } from "../../../interfaces/jira.responses";
import { Form, InputRef } from "antd";
import Input from "rc-input";
import { EditableContext } from "../context/editable.context";
import get from "lodash/get";
import set from "lodash/set";

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: (keyof JiraIssue)[];
  record: JiraIssue;
  handleSave: (record: JiraIssue) => void;
}

export const EditableCell: FC<PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);

    const data = set({}, dataIndex.join("."), get(record, dataIndex.join(".")));
    form.setFieldsValue(data);
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave(
        set(record, dataIndex.join("."), get(values, dataIndex.join(".")))
      );
    } catch (errInfo) {
      console.error("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24, padding: "5px 12px", cursor: "pointer" }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
