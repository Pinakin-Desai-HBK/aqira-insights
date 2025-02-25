import { SxProps } from "@mui/material";

export type InlineEditValidationResult = { valid: true } | { valid: false; errorMessage: string };

type InlineEditValidator = (value: string) => InlineEditValidationResult;

export type InlineEditState = {
  error: boolean;
  value: string;
  errorMessage: string;
  startValue: string | undefined;
};

export type InlineEditProps = {
  value: string;
  validator: InlineEditValidator;
  onUpdate: (value: string) => void;
  onCancel?: () => void;
  setEditing: (editing: boolean) => void;
  editing: boolean;
  className?: string;
  dataTestId?: string;
  textColor: string;
  maxWidth?: number;
  blockStart?: boolean;
  sx?: SxProps;
};
