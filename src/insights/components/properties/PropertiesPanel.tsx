import Box from "@mui/material/Box";
import { memo, useMemo } from "react";
import PropertiesGroup from "./PropertiesGroup";
import ContentPanel from "../panel/ContentPanel";
import { useGetPropertiesDataQuery } from "src/insights/redux/api/appApi";
import { PropertyGroupData } from "src/insights/redux/types/schemas/properties";
import { skipToken } from "@reduxjs/toolkit/query";
import { parse as jsonBigIntParse } from "json-bigint";
import { PropertyGroupsData } from "src/insights/redux/types/ui/properties";
import { WorkspaceTypes } from "src/insights/redux/types/redux/workspaces";
import { selectStore_UI_Workspace_SelectedWorkspaceItem } from "src/insights/redux/slices/ui/workspace/workspaceSlice";
import { useAppSelector } from "src/insights/redux/hooks/hooks";

const getDetailsGroup = ({ type }: { type: WorkspaceTypes }): PropertyGroupData => ({
  name: type === "Network" ? "Node Details" : "Visualization Details",
  properties: [
    { name: "Type", type: "String", disabled: true, supportsExpression: false, description: "" },
    { name: "Name", type: "String", disabled: false, supportsExpression: false, description: "" }
  ]
});

const usePropertiesData = (): PropertyGroupsData | null => {
  const selectedWorkspaceItem = useAppSelector(selectStore_UI_Workspace_SelectedWorkspaceItem);
  const { data: propertiesData } = useGetPropertiesDataQuery(selectedWorkspaceItem?.data.identifier ?? skipToken);
  const preparedPPropertiesData = useMemo(() => {
    if (!propertiesData || !selectedWorkspaceItem) return null;
    const parsed = jsonBigIntParse(propertiesData);
    return {
      key: selectedWorkspaceItem.data.id + parsed.type,
      groups: [getDetailsGroup(selectedWorkspaceItem.data.identifier.workspace), ...parsed.propertyGroups]
    };
  }, [propertiesData, selectedWorkspaceItem]);

  return preparedPPropertiesData;
};

const PropertiesPanel = memo(() => {
  const propertyGroupsData = usePropertiesData();

  return (
    <ContentPanel
      title="Properties"
      background="white"
      titleColor="text.primary"
      sx={{ border: "1px solid transparent", borderRadius: "5px" }}
    >
      {propertyGroupsData !== null ? (
        <Box
          height={"calc(100% - 38px)"}
          overflow="auto"
          className="AI-properties-container"
          sx={{ paddingBottom: "7px" }}
        >
          {propertyGroupsData.groups.map(({ properties: propertyDataArray, name }, index) => (
            <PropertiesGroup key={propertyGroupsData.key + index} propertyDataArray={propertyDataArray} name={name} />
          ))}
        </Box>
      ) : (
        <></>
      )}
    </ContentPanel>
  );
});

PropertiesPanel.displayName = "PropertiesPanel";

export default PropertiesPanel;
