import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { appApi } from "src/react/redux/api/appApi";
import { UIDataPanelSlice } from "src/react/redux/types/redux/dataPanel";
import { appLabels } from "src/react/consts/labels";
import { parse as jsonBigIntParse, stringify as jsonBigIntStringify } from "json-bigint";
import { GetColumnDetailsDataResponse } from "src/react/redux/types/schemas/dataExplorer";
import { isErrorDetails } from "src/react/redux/api/utils/isErrorDetails";
import { LocalStorage } from "src/react/enums/enums";

const labels = appLabels.dataPanelExtraReducers;

export const extraReducers = (builder: ActionReducerMapBuilder<UIDataPanelSlice>) => {
  builder.addMatcher(appApi.endpoints.getDataFiles.matchFulfilled, (state, { payload: dataFiles }) => {
    state.initialDataFiles = dataFiles;
    state.noDataFilesInFolder = dataFiles.length === 0;
  });
  builder.addMatcher(appApi.endpoints.getDataFiles.matchRejected, (state, { payload }) => {
    if (payload?.status === 404) {
      localStorage.setItem(LocalStorage.DataExplorerSelectedFolder, "");
      state.folder = "";
    }
    state.initialDataFiles = [];
    state.noDataFilesInFolder = true;
  });
  builder.addMatcher(appApi.endpoints.getColumnDetailsData.matchFulfilled, (state, { payload: result }) => {
    if (isErrorDetails(result)) {
      state.columnDetails = {
        ...state.columnDetails,
        apiError: result
      };
      return;
    }
    const columnDetailsData: GetColumnDetailsDataResponse = jsonBigIntParse(result);
    if (columnDetailsData.status === "Completed") {
      state.columnDetails = {
        ...state.columnDetails,
        data: jsonBigIntStringify(columnDetailsData.fileDetails),
        dataStatus: columnDetailsData.status
      };
      return;
    }
    if (columnDetailsData.status === "Failed") {
      state.columnDetails = {
        ...state.columnDetails,
        error: labels.unableToEvaluateColumnDetails,
        dataStatus: columnDetailsData.status
      };
      return;
    }
    state.columnDetails = {
      ...state.columnDetails,
      dataStatus: columnDetailsData.status
    };
  });
  builder.addMatcher(appApi.endpoints.getColumnDetailsData.matchRejected, (state, { payload: error }) => {
    state.columnDetails = {
      ...state.columnDetails,
      error: error?.data?.toString() ?? labels.unableToEvaluateColumnDetails
    };
  });
  builder.addMatcher(appApi.endpoints.getColumnDetails.matchFulfilled, (state, { payload: result }) => {
    state.columnDetails = {
      ...state.columnDetails,
      id: result.id,
      status: result.status
    };
  });
  builder.addMatcher(appApi.endpoints.getColumnDetails.matchRejected, (state, { error: { message } }) => {
    state.columnDetails = {
      ...state.columnDetails,
      error: message ?? labels.unableToEvaluateColumnDetails
    };
  });
  builder.addMatcher(appApi.endpoints.getDisplayNodes.matchFulfilled, (state, { payload: displayNodes }) => {
    state.initialDisplayNodes = displayNodes;
  });
};
