import { Position } from "./ui/networkNodes";

export type CreateEdgePayload = {
  sourceNode: string;
  destinationNode: string;
  sourcePort: string;
  destinationPort: string;
};

export type DeleteEdgePayload = {
  sourceNode: string;
  destinationNode: string;
  sourcePort: string;
  destinationPort: string;
};

export type CreateNodePayload = {
  type: string;
  position: Position;
};

export type UpdatePropertyExpressionPayload = {
  expression: string | null;
};

export type UpdatePropertyValuePayload = {
  value: string | number | boolean | string[] | null;
  type: string;
  networkRun?: boolean | null; // make this optional
};

export type CreateVisualizationPayload = {
  type: string;
  position: Position;
};

export type LoadProjectPayload = {
  filepath: string;
};

export type ExportAsPythonPayload = {
  exportPath: string;
  overwrite: boolean;
  networkId: string;
};

export type FeedbackPayload = {
  feedbackRating: number;
  improvementOptions: string[];
};
