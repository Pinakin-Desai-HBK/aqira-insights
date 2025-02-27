import Stack from "@mui/material/Stack";
import { Panel, PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../resize-handle/ResizeHandle";
import { Fragment, memo } from "react";
import { PalettePanelSideBarItem } from "src/insights/redux/types/ui/palette";

const PalettePanelGroup = memo(({ items }: { items: PalettePanelSideBarItem[] }) => (
  <PanelGroup id="AI-Palette-Panel-Group" autoSaveId="AI-Palette-Panel-Group" direction="vertical">
    <Stack sx={{ height: 1 }} data-testid="AI-panel-group">
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <Panel id={index.toString()} order={index + 1} style={{ minHeight: "200px" }}>
            {item.component}
          </Panel>
          {items.length > 1 && index < items.length - 1 ? <ResizeHandle /> : null}
        </Fragment>
      ))}
    </Stack>
  </PanelGroup>
));
PalettePanelGroup.displayName = "PanelGroup";

export default PalettePanelGroup;
