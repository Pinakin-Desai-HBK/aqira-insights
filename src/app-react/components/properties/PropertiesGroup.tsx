import { Typography, useTheme } from "@mui/material";
import { WorkspaceItemProperties } from "src/redux/types/schemas/workspace-item";
import { useProperties } from "src/redux/hooks/useProperties";
import { PropertyInputProps } from "src/redux/types/ui/properties";
import AccordionGroup from "src/components/accordion-group/AccordionGroup";
import { Property } from "src/redux/types/schemas/properties";
import { RenderPropertiesGroup } from "./RenderPropertiesGroup";
import { selectStore_UI_Workspace_SelectedWorkspaceItem } from "src/redux/slices/ui/workspace/workspaceSlice";
import { useAppSelector } from "src/redux/hooks/hooks";
import { useState } from "react";
import { appLabels } from "src/consts/labels";

const getDetailsValues = ({ name, type }: { type: string; name: string }): WorkspaceItemProperties => ({
  Type: { expression: "", setting: "Value", type: "String", value: type },
  Name: { expression: "", setting: "Value", type: "String", value: name }
});

const labels = appLabels.PropertiesGroup;

const PropertiesGroup = ({
  propertyDataArray,
  name
}: {
  propertyDataArray: PropertyInputProps<Property>[];
  name: string;
}) => {
  const {
    palette: { properties: theme }
  } = useTheme();
  const [expanded, setExpanded] = useState(true);
  const selectedWorkspaceItem = useAppSelector(selectStore_UI_Workspace_SelectedWorkspaceItem);
  const properties = useProperties(selectedWorkspaceItem?.data.identifier ?? null);

  if (!properties || !selectedWorkspaceItem) return null;
  return (
    <AccordionGroup
      name={name}
      idPrefix="AI-properties-group-"
      toggleTheme={theme}
      heading={
        <Typography color={theme.text} marginLeft={1} fontSize="small">
          {name}
        </Typography>
      }
      sx={{
        overflowY: "auto",
        "& .MuiIconButton-root:hover": { stroke: "#00457B" }
      }}
      sxDetails={{
        background: theme.group,
        margin: "0 8px",
        borderRadius: 2,
        padding: "6px 0px"
      }}
      sxSummary={{
        "& .MuiSvgIcon-root": { color: theme.groupToggle, fontSize: "12px" },
        flexDirection: "row-reverse"
      }}
      optional={{
        expanded,
        onChange: (_e, expanded) => setExpanded(expanded)
      }}
      toggleLabel={`${name} ${labels.properties}`}
    >
      <RenderPropertiesGroup
        propertyDataArray={propertyDataArray}
        properties={{
          ...getDetailsValues({ name: selectedWorkspaceItem?.data.name, type: selectedWorkspaceItem?.data.type }),
          ...properties
        }}
      />
    </AccordionGroup>
  );
};

export default PropertiesGroup;
