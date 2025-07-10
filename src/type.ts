export type BaseField = {
  checked?: boolean;
  label: string;
  field_name: string;
  doctype?: string;
  options?: OptionType[];
  type:
    | "char"
    | "int"
    | "float"
    | "select"
    | "date"
    | "datetime"
    | "link"
    | "child_table";
  default?: any;
  hidden?: boolean;
  readonly?: boolean;
  required?: boolean;
};

export type Field = BaseField & {
  child_fields?: BaseField[];
};

export type OptionType = { label: string; value: string };

export const generateDefaultValues = (fields: Field[]) => {
  const defaults: Record<string, any> = {};

  fields.forEach((field) => {
    defaults[field.field_name] = field.default;
  });

  return defaults;
};
