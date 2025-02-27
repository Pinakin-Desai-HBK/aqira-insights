import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { VisualizationDetailsContext } from "src/insights/components/dashboard-visualization/context/VisualizationDetailsContext";
import { VisualizationDetails } from "src/insights/redux/types/ui/visualizationDetails";
import { HistogramKey } from "src/insights/redux/types/schemas/dashboardVisualizations";
import { getTextWidth } from "src/insights/components/inline-edit/text-utils";
import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";

export const ChannelSelect = ({
  channelNames,
  selectedChannel,
  setSelectedChannel
}: {
  selectedChannel: string;
  channelNames: string[];
  setSelectedChannel: (channelName: string) => void;
}) => {
  const theme = useTheme();
  const { name } = useContext(VisualizationDetailsContext) as VisualizationDetails<HistogramKey>;

  const [fieldValue, setFieldValue] = useState<string | null>(null);

  useEffect(() => {
    if (!fieldValue || selectedChannel !== fieldValue) {
      const channelName =
        (selectedChannel && channelNames.includes(selectedChannel) ? selectedChannel : channelNames[0]) ?? null;
      setFieldValue(channelName);
      if (channelName === null) return;

      const channelIndex = channelNames.indexOf(channelName);
      setPrevIsEnabled(channelIndex > 0);
      setNextIsEnabled(channelIndex < channelNames.length - 1);
    }
  }, [channelNames, fieldValue, selectedChannel]);

  const processChannelIndexChange = useCallback(
    (channelIndex: number) => {
      const newChannel = channelNames[channelIndex];
      if (!newChannel) return;
      setSelectedChannel(newChannel);
    },
    [channelNames, setSelectedChannel]
  );

  const handleChannelSelection = useCallback(
    (event: SelectChangeEvent<string>) => {
      const channelIndex = channelNames.indexOf(event.target.value || "");
      if (channelIndex === -1) return;
      processChannelIndexChange(channelIndex);
    },
    [channelNames, processChannelIndexChange]
  );

  const handleNextChannel = useCallback(() => {
    const channelIndex = channelNames.indexOf(fieldValue || "");
    if (channelIndex === -1) return;
    processChannelIndexChange(channelIndex + 1);
  }, [channelNames, fieldValue, processChannelIndexChange]);

  const handlePrevChannel = useCallback(() => {
    const channelIndex = channelNames.indexOf(fieldValue || "");
    if (channelIndex === -1) return;
    processChannelIndexChange(channelIndex - 1);
  }, [channelNames, fieldValue, processChannelIndexChange]);

  const [nextIsEnabled, setNextIsEnabled] = useState<boolean>(
    fieldValue !== null && channelNames.indexOf(fieldValue) < channelNames.length - 1
  );

  const [prevIsEnabled, setPrevIsEnabled] = useState<boolean>(
    fieldValue !== null && channelNames.indexOf(fieldValue) > 0
  );

  const fieldWidth = useMemo(() => {
    return channelNames.reduce((acc, channelName) => {
      return Math.max(acc, getTextWidth(channelName, "12px Verdana") ?? 0);
    }, 0);
  }, [channelNames]);
  const numChannels = channelNames.length || 0;
  const showControls = numChannels > 1;
  return numChannels > 0 && fieldValue ? (
    <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {showControls ? (
        <Box sx={{ display: "flex", width: "50%", flexShrink: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
          <IconButton
            data-testid={`AI-histogram-prev-channel-${name}`}
            disabled={!prevIsEnabled}
            onClick={handlePrevChannel}
            style={{ padding: "0px" }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      ) : null}
      {showControls ? (
        <Box sx={{ flexShrink: 1 }}>
          <Select
            data-testid={`AI-histogram-select-channel-${name}`}
            value={fieldValue || ""}
            onChange={handleChannelSelection}
            size="small"
            autoWidth
            sx={{
              fontSize: "12px",
              ".MuiInputBase-input": { paddingTop: "3px", paddingBottom: "2px" },
              width: `${fieldWidth + 30}px`
            }}
          >
            {channelNames.map((channelName) => (
              <MenuItem
                key={channelName}
                value={channelName}
                className="channel-select-item"
                selected={channelName === fieldValue}
                sx={{ fontSize: "12px", color: theme.palette.properties.text }}
              >
                {channelName}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ) : (
        <Box
          sx={{ fontSize: "12px", height: "32px", display: "flex", alignItems: "center" }}
          data-testid={`AI-histogram-channel-name-${name}`}
        >
          {fieldValue}
        </Box>
      )}
      {showControls ? (
        <Box
          sx={{ display: "flex", width: "50%", flexShrink: 1, justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <IconButton
            data-testid={`AI-histogram-next-channel-${name}`}
            disabled={!nextIsEnabled}
            onClick={handleNextChannel}
            style={{ padding: "0px" }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      ) : null}
    </Box>
  ) : null;
};
