import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import { FileBrowserNameInputProps } from "src/insights/redux/types/ui/fileBrowser";

export const FileBrowserNameInput = memo(function FileBrowserNameInputMemo({
  errorMessage,
  label,
  value,
  handleConfirm,
  onChange
}: FileBrowserNameInputProps) {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      alignItems="top"
      borderBottom={"1px solid"}
      borderColor={theme.palette.fileBrowser.border}
      sx={{ background: "#F8F8F8", padding: "16px 16px 24px" }}
    >
      <Typography data-testid="AI-file-browser-name-input-label" whiteSpace="nowrap" marginRight={1} marginTop={1}>
        {label}:
      </Typography>
      <TextField
        data-testid="AI-file-browser-name-textfield"
        size="small"
        fullWidth
        sx={{
          background: "white",
          "& .MuiFormHelperText-root": {
            position: "absolute",
            bottom: "-24px",
            margin: 0,
            padding: "4px 14px 0;",
            background: "#F8F8F8"
          }
        }}
        slotProps={{ htmlInput: { "data-testid": "AI-file-browser-name-input" } }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!errorMessage}
        helperText={errorMessage}
        onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
      />
    </Box>
  );
});
