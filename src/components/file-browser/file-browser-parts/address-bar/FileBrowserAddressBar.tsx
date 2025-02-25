import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useTheme from "@mui/material/styles/useTheme";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import { KeyboardEvent } from "react";
import { FileBrowserAddressBarProps } from "src/redux/types/ui/fileBrowser";

export const FileBrowserAddressBar = memo(function FileBrowserAddressBarMemo({
  selectedFolder,
  handleNewPath,
  handlePathPartSelection
}: FileBrowserAddressBarProps) {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(selectedFolder.path.slice(1).join("\\"));
    setTimeout(() => {
      if (editing && inputRef.current) inputRef.current.select();
    }, 0);
  }, [editing, setInputValue, selectedFolder]);

  useEffect(() => {
    setInputValue(selectedFolder.path.join("\\"));
  }, [selectedFolder]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditing(false);
      handleNewPath(inputValue);
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setEditing(false);
    }
  };

  return (
    <Box padding={2} sx={{ background: "#F8F8F8" }} position="relative">
      {editing ? (
        <TextField
          inputRef={inputRef}
          data-testid="AI-file-browser-path-text-field"
          size="small"
          fullWidth
          sx={{ background: "white", "&:focus": { border: "none" } }}
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputValue(e.target.value)}
          slotProps={{
            htmlInput: {
              style: { fontSize: "0.875rem", paddingBottom: "10px" },
              "data-testid": "AI-file-browser-path-input"
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            setInputValue(e.clipboardData.getData("Text"));
          }}
          onBlur={() => setEditing(false)}
        />
      ) : (
        <Box
          padding={0}
          border={"1px solid"}
          display="flex"
          alignItems="center"
          sx={{ background: "white", "&:hover": { borderColor: theme.palette.fileBrowser.hoverBorder } }}
          borderColor={theme.palette.fileBrowser.border}
          borderRadius={1}
          onClick={() => setEditing(true)}
          data-testid="AI-file-browser-address-bar"
        >
          {selectedFolder &&
            selectedFolder.path.map((item, index) => (
              <Fragment key={`${item}-${index}`}>
                <Typography>{index !== 0 ? " > " : ""}</Typography>
                <Button
                  data-testid={`AI-file-browser-address-bar-item-${item}`}
                  variant="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePathPartSelection(index);
                  }}
                  sx={{ minWidth: 0, textTransform: "none" }}
                >
                  {item}
                </Button>
              </Fragment>
            ))}
        </Box>
      )}
    </Box>
  );
});
