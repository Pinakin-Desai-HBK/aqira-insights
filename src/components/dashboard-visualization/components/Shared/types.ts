import {
  DataSet,
  DataSetDetails,
  DataSetId,
  DataVisTypes,
  FilteredVisualizationProperties,
  VisualizationDataContextError
} from "src/redux/types/ui/dashboardVisualization";
import { CloseDialog, InformationDialogParams } from "src/redux/types/ui/dialogs";

export type ActionsInformationDialogParams = {
  closeInformationDialog: CloseDialog;
  openInformationDialog: (props: InformationDialogParams) => void;
};

export type CommonParams<T extends DataVisTypes> = {
  dataSetDetails: DataSetDetails;
  properties: FilteredVisualizationProperties<T>;
};

export type GetSchema<T extends DataVisTypes> = (dataSetId: DataSetId) => Promise<DataSet<T>>;

export type VIS_ERROR_TYPES = "NO_DATA_AVAILABLE" | VisualizationDataContextError | "DATA_LOADING" | "DATA_INVALID";
