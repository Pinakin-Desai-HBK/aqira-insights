import { NameInputValidationError } from "src/react/redux/types/ui/dialogs";
import { getLabelPart } from "./getLabelPart";
import { WorkspaceTabNameValidatorParams } from "src/react/redux/types/ui/workspaceTabs";

export const workspaceTabNameValidator = ({
  index,
  isNameUnique,
  type,
  value
}: WorkspaceTabNameValidatorParams): NameInputValidationError => {
  const isWhitespace = value.length > 0 && value.trim().length === 0;
  if (isWhitespace)
    return { errorMessage: `${getLabelPart(type)} name must not be empty or white space`, valid: false };
  const trimmed = value.trim();
  const isTooLong = trimmed.length > 32;
  if (isTooLong) return { errorMessage: `${getLabelPart(type)} name must be at most 32 characters`, valid: false };
  const isTooShort = trimmed.length < 3;
  if (isTooShort) return { errorMessage: `${getLabelPart(type)} name must be at least 3 characters`, valid: false };
  if (!isNameUnique(index, trimmed)) return { errorMessage: `${getLabelPart(type)} name must be unique`, valid: false };
  return { valid: true };
};
