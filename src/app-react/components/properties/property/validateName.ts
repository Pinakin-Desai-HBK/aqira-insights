import { NameValidator } from "../../workspace-canvas/hooks/useWorkspaceItemNameValidator";

export const validateName = (newValue: string, nameValidator: NameValidator | null, nodeId: string | null) => {
  if (newValue === null || newValue.trim() === "") return "Name cannot be empty";
  if (newValue.trim().length > 90) return "Name must contain no more than 90 characters";
  if (nodeId && nameValidator && !nameValidator({ sourceId: nodeId, name: newValue })) return "Name has been used";
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/g.test(newValue)) {
    if (/^\d+.*/g.test(newValue)) return "Name cannot start with a number";
    return "Name can contain only letters, numbers, and underscores";
  }
  return "";
};
