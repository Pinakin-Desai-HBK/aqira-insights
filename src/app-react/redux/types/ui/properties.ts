import { ReactElement } from "react";
import { Property } from "../schemas/properties";
import { PropertyGroupData } from "../schemas/properties";
import { WorkspaceItemProperty } from "../schemas/workspace-item";

export type PropertyInputProps<T extends Property> = T;

export type PropertyParams<T extends Property> = {
  propertyFieldProps: PropertyInputProps<T>;
  property: WorkspaceItemProperty;
  index: number;
};

export type PropertyComponentProps = {
  children?: ReactElement;
  isExpression: boolean;
} & PropertyParams<Property>;

export type PropertyGroupsData = {
  key: string;
  groups: PropertyGroupData[];
};

export type UpdateHandler<T> = (updatedValue: T) => Promise<WorkspaceItemProperty | null>;

export type UsePropertyUtilsHookResponse = {
  openRichTextEditor: () => void;
  openExpressionEditor: () => void;
  updateProperty: UpdateHandler<PropertyValueTypes>;
  switchToExpression: (name: string) => void;
  switchToValue: (name: string) => void;
};

export type PropertyValueTypes = string | number | boolean | string[] | null;
