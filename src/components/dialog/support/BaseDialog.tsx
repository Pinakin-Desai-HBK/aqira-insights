import Close from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme
} from "@mui/material";
import { MouseEvent } from "react";
import { BaseDialogOnlyParams, BaseDialogParams } from "src/redux/types/ui/dialogs";

const BaseDialog = (props: BaseDialogParams & BaseDialogOnlyParams) => {
  const theme = useTheme();
  const {
    messageParts,
    message,
    children,
    title,
    testidPrefix,
    buttons,
    close,
    maxWidth,
    contentSx,
    messageSx,
    actionsSx
  } = props;
  const onClose = (e: MouseEvent | null) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!buttons) return false;
    if (close) close();
    return false;
  };
  return (
    <Dialog
      open={true}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;
        onClose(null);
      }}
      maxWidth={maxWidth || "sm"}
      fullWidth
      data-testid={`${testidPrefix}`}
      id={`${testidPrefix}`}
    >
      <DialogTitle sx={{ padding: "0" }}>
        <Box
          padding={0}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ background: theme.palette.sidebar.background }}
        >
          <Typography
            data-testid={`${testidPrefix}-title`}
            id={`${testidPrefix}-title`}
            sx={{ color: "text.secondary", paddingLeft: "16px" }}
          >
            {title}
          </Typography>
          {close && (
            <IconButton data-testid={`${testidPrefix}-close-button`} sx={{ color: "text.secondary" }} onClick={onClose}>
              <Close />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ ...contentSx, paddingBottom: buttons ? "0" : "20px" }}>
        {message && (
          <Typography
            key={`${testidPrefix}-message`}
            sx={{ ...messageSx, paddingTop: "20px" }}
            data-testid={`${testidPrefix}-message`}
          >
            {message}
          </Typography>
        )}
        {messageParts?.map((message, index) => (
          <Typography
            key={`${testidPrefix}-message-${index}`}
            sx={{ ...messageSx, paddingTop: index === 0 ? "20px" : "0" }}
          >
            {message}
          </Typography>
        ))}
        {children}
      </DialogContent>
      {buttons && (
        <DialogActions sx={{ ...actionsSx }}>
          <Box padding={0.25} display="flex" justifyContent="flex-end">
            {buttons.map(({ callback, disabled, label, testidSuffix }, index) => {
              return (
                <Button
                  key={`${testidPrefix}-${testidSuffix}-${index}`}
                  data-testid={`${testidPrefix}-${testidSuffix}`}
                  color={index === buttons.length - 1 ? "primary" : "secondary"}
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    callback();
                    return false;
                  }}
                  sx={{ marginLeft: "8px" }}
                  disabled={disabled}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default BaseDialog;
