import { Form } from "antd";
import { EditableContext } from "../context/editable.context";

interface EditableRowProps {
  index: number;
}

export const EditableRow: React.FC<EditableRowProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index: _,
  ...props
}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
