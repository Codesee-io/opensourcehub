import { FC, ReactNode, useState } from "react";
import { nanoid } from "nanoid";
import Button from "./Button";

type Props = {
  placeholder?: string;
  maxFields?: number;
  label: ReactNode;
  name: string;
  type?: string;
};

/**
 * Renders a group of one or more input fields with buttons to add and remove
 * each field. Use the getRepeatableFieldValues() function to extract values in
 * a form.
 *
 * @see getRepeatableFieldValues
 */
const RepeatableTextFields: FC<Props> = ({
  placeholder,
  label,
  name,
  maxFields = 10,
  type = "text",
}) => {
  // Give each field a unique id so that we can delete them properly
  const [fields, setFields] = useState([nanoid()]);

  const canAdd = fields.length < maxFields;
  const canRemove = fields.length > 1;

  const addField = () => {
    setFields((prev) => [...prev, nanoid()]);
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f !== id));
  };

  return (
    <div className="space-y-2">
      <label className="input-label">{label}</label>
      {fields.map((fieldId, index) => (
        <div key={fieldId} className="flex gap-4">
          <input
            className="input"
            type={type}
            placeholder={placeholder}
            name={`${name}_${index}`}
          />
          <Button
            type="button"
            disabled={!canRemove}
            onClick={() => removeField(fieldId)}
            title="Remove this field"
          >
            -
          </Button>
          <Button
            type="button"
            disabled={!canAdd}
            onClick={addField}
            title="Add another field"
          >
            +
          </Button>
        </div>
      ))}
    </div>
  );
};

export default RepeatableTextFields;
