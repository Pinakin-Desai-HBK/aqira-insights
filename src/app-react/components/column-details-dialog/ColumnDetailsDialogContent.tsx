import { useEffect, useMemo, useState } from "react";
import { useGetColumnDetailsDataQuery, useGetColumnDetailsQuery } from "src/redux/api/appApi";
import { useAppDispatch, useAppSelector } from "src/redux/hooks/hooks";
import { make_selectStore_UI_DataPanel_ForColumnDetails } from "src/redux/slices/ui/dataPanel/combinedSelectors";
import { DataFileDetails } from "src/redux/types/ui/dataExplorer";
import { ColumnDetailsMessage } from "./components/ColumnDetailsMessage";
import { skipToken } from "@reduxjs/toolkit/query";
import { uiDataPanel_clearDataColumns } from "src/redux/slices/ui/dataPanel/dataPanelSlice";
import { appLabels } from "src/consts/labels";
import { RenderColumnDetails } from "./RenderColumnDetails";

const labels = appLabels.ColumnDetailsDialogContent;

export const ColumnDetailsDialogContent = (props: DataFileDetails) => {
  const {
    dataFileDetails: { filePath }
  } = props;
  const columnDetailsSelector = useMemo(make_selectStore_UI_DataPanel_ForColumnDetails, []);
  const { folderChangeTimestamp, columnDetails } = useAppSelector(columnDetailsSelector);
  const dispatch = useAppDispatch();
  useGetColumnDetailsQuery({ filePath, timestamp: folderChangeTimestamp }, { refetchOnMountOrArgChange: true });
  const { refetch } = useGetColumnDetailsDataQuery(
    columnDetails.id ? { id: columnDetails.id, timestamp: folderChangeTimestamp } : skipToken
  );
  const [columnDetailsData, setColumnDetailsData] = useState<string | null>(null);

  useEffect(() => {
    if (columnDetails.id) {
      setTimeout(() => {
        if (!columnDetails.data) {
          refetch();
        } else {
          setColumnDetailsData(columnDetails.data);
        }
      }, 2000);
    }
  }, [columnDetails.data, columnDetails.id, dispatch, refetch]);

  useEffect(() => {
    return () => {
      dispatch(uiDataPanel_clearDataColumns());
    };
  }, [dispatch]);

  if (columnDetailsData) {
    return <RenderColumnDetails {...props} columnDetails={columnDetailsData} />;
  }
  if (columnDetails.error) {
    return <ColumnDetailsMessage columnDetailsError={columnDetails.error} />;
  }
  if (columnDetails.apiError) {
    return <ColumnDetailsMessage columnDetailsError={columnDetails.apiError.message} />;
  }
  if (columnDetails.status === "Failed") {
    return <ColumnDetailsMessage columnDetailsError={labels.unableToEvaluateColumnDetails} />;
  }

  return <ColumnDetailsMessage columnDetailsError={labels.loadingColumnDetails} showSpinner={true} />;
};
