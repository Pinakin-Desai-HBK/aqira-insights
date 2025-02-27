import React, { ChangeEventHandler, ComponentProps, KeyboardEventHandler, ReactElement } from "react";
import { APIError } from "src/react/redux/api/utils/responseValidator";
import { FileBrowserAction, FileSystemContentFileFilter } from "./fileBrowser";
import ConfirmDialog from "src/react/components/dialog/dialogs/ConfirmDialog";
import NameInputDialog from "src/react/components/dialog/dialogs/NameInputDialog";
import CheckboxDialog from "src/react/components/dialog/dialogs/CheckboxDialog";
import FileDialog from "src/react/components/dialog/dialogs/FileDialog";
import ErrorMessageDialog from "src/react/components/dialog/dialogs/ErrorMessageDialog";
import StatusMessageDialog from "src/react/components/dialog/dialogs/StatusMessageDialog";
import RichTextEditorDialog from "src/react/components/dialog/dialogs/RichTextEditorDialog";
import AboutDialog from "src/react/components/dialog/dialogs/AboutDialog";
import InformationDialog from "src/react/components/dialog/dialogs/InformationDialog";
import ExpressionEditorDialog from "src/react/components/dialog/dialogs/ExpresssionEditorDialog";
import ColumnDetailsDialog from "src/react/components/dialog/dialogs/ColumnDetailsDialog";
import { DataFileDetails } from "./dataExplorer";
import FeedbackDialog from "src/react/components/dialog/dialogs/FeedbackDialog";
import { JSX } from "react";
import { Breakpoint, SxProps, Theme } from "@mui/material/styles";

export type DialogTextFieldState = {
  error: boolean;
  value: string;
  helperText: string;
};

export type DialogTextFieldProps = {
  value: string;
  fieldState: DialogTextFieldState;
  onKeyUp: KeyboardEventHandler<HTMLDivElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  testId: string;
};

export type DialogCheckboxProps = {
  label: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  testId: string;
};

export type BaseDialogButtonParams = {
  label: string;
  callback: () => void;
  disabled: boolean;
  testidSuffix: string;
};

export type BaseDialogParams = {
  message?: string | undefined;
  messageParts?: string[] | undefined;
  contentSx?: SxProps<Theme> | undefined;
  messageSx?: SxProps<Theme> | undefined;
  actionsSx?: SxProps<Theme> | undefined;
  maxWidth?: false | Breakpoint | undefined;
  fullWidth?: boolean | undefined;
  title: string;
};

export type BaseDialogOnlyParams = {
  children?: ReactElement;
  testidPrefix: string;
  buttons?: BaseDialogButtonParams[];
  close?: () => void;
  hideCloseButton?: boolean;
};

export type AboutDialogParams = BaseDialogParams & {
  okLabel?: string;
  onOk: () => void;
};

export type CheckBoxDialogParams = BaseDialogParams & {
  message: string;
  checkBoxProps: {
    label: string;
    checked: boolean;
    testId: string;
  };
  okLabel?: string;
  onCancel: () => void;
  onOk: (checked: boolean) => void;
};

export type ConfirmDialogParams = BaseDialogParams & {
  message: string;
  okLabel?: string;
  onOk: () => void;
  onCancel: () => void;
};

export type ErrorMessageDialogParams = Omit<BaseDialogParams, "messageParts"> & {
  okLabel?: string;
  onOk: () => void;
  error: APIError;
};

export type ExpressionEditorDialogParams = BaseDialogParams & {
  expression: string;
  identifier: string;
  showOverview: boolean;
  onOk: (expr: string) => void;
  onCancel: () => void;
};

export type FileDialogParams = BaseDialogParams & {
  action: FileBrowserAction;
  confirmButtonText: string;
  contentFileFilter: FileSystemContentFileFilter;
  nameInputLabel: string;
  onOk: (filepath: string) => void;
  onCancel: () => void;
};

export type FeedbackDialogParams = BaseDialogParams & {
  title: string;
};

type FixedArray<N extends number, T> = N extends 0
  ? never[]
  : {
      length: N;
    } & ReadonlyArray<T>;

type InformationContentRow<N extends number> = FixedArray<N, string>;

export type InformationItemContent<N extends number> = {
  columns: N;
  rowTemplate: FixedArray<N, "auto" | `${number}px` | `${number}%`>;
  rows: InformationContentRow<N>[];
};

type InformationItem =
  | {
      type: "contentWithHeading";
      heading: string;
      content: InformationItemContent<number>;
    }
  | {
      type: "heading";
      heading: string;
    }
  | {
      type: "content";
      content: InformationItemContent<number>;
    };

export type InformationDialogParams = Omit<BaseDialogParams, "messageParts"> & {
  okLabel?: string;
  onOk: () => void;
  contents: InformationItem[];
  testidPrefix: string;
};

export type NameInputValidationError = { valid: true } | { valid: false; errorMessage: string };

export type NameInputDialogParams = BaseDialogParams & {
  value: string;
  validator: (value: string) => NameInputValidationError;
  onOk: (result: { value: string }) => void;
  onCancel: () => void;
};

export type RichTextEditorDialogParams = BaseDialogParams & {
  richText: string | null;
  identifier: string;
  onOk: (expr: string) => void;
  onCancel: () => void;
};

export type StatusMessageDialogParams = BaseDialogParams & {
  targetWorkspaceId?: string | undefined;
  showInMain?: boolean | undefined;
};

export type CloseDialog = () => void;

export type DialogContextParams<T> = T extends DialogComponents
  ? T["displayName"] extends "StatusMessageDialog"
    ? never
    : {
        name: T["displayName"];
        props: ComponentProps<T>;
      }
  : never;

export type DialogContextStatusParams<T> = T extends DialogComponents
  ? T["displayName"] extends "StatusMessageDialog"
    ? {
        name: T["displayName"];
        props: ComponentProps<T>;
      }
    : never
  : never;

export type DialogContextData = {
  closeDialog: () => void;
  dialogDetails: DialogContextParams<DialogComponents> | null;
  openDialog: React.Dispatch<React.SetStateAction<DialogContextParams<DialogComponents> | null>>;
  closeStatusDialog: () => void;
  statusDialogDetails: DialogContextStatusParams<typeof StatusMessageDialog> | null;
  openStatusDialog: React.Dispatch<React.SetStateAction<DialogContextStatusParams<typeof StatusMessageDialog> | null>>;
};

export const DialogComponentList = [
  ConfirmDialog,
  NameInputDialog,
  CheckboxDialog,
  FileDialog,
  ErrorMessageDialog,
  ExpressionEditorDialog,
  RichTextEditorDialog,
  AboutDialog,
  InformationDialog,
  StatusMessageDialog,
  ColumnDetailsDialog,
  FeedbackDialog
] as const;

export type DialogComponents = (typeof DialogComponentList)[number];

export type OpenDialogHandlerType<T extends DialogComponents> = (
  name: T["displayName"],
  params: ComponentProps<T>
) => JSX.Element | null;

export type ColumnDetailsDialogParams = Omit<BaseDialogParams, "messageParts" | "message"> &
  DataFileDetails & {
    onOk: () => void;
  };
