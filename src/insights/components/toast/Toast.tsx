import { memo, SyntheticEvent, useCallback, useEffect, useMemo } from "react";
import Close from "@mui/icons-material/Close";
import Info from "@mui/icons-material/Info";
import { TransitionComponent } from "src/insights/redux/types/ui/toast";
import { TOAST_DELAY, TOAST_REDUCED_DELAY } from "../../consts/consts";
import "./Toast.css";
import { selectStore_UI_Toast, uiToast_removeFirst } from "src/insights/redux/slices/ui/toast/toastSlice";
import { useAppDispatch, useAppSelector } from "src/insights/redux/hooks/hooks";
import { ToastIconLookup } from "./ToastContent";
import { useToastManager } from "./useToastManager";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/material/styles";

export const Toast = memo(({ sx, toastKey }: { sx: SxProps; toastKey: string }) => {
  const appDispatch = useAppDispatch();

  const toastState = useAppSelector(selectStore_UI_Toast);

  const handleClose = useCallback(
    (_: SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      appDispatch(uiToast_removeFirst());
    },
    [appDispatch]
  );

  const barColor = useMemo(() => toastState.current?.barColor ?? undefined, [toastState]);
  const iconColor = useMemo(() => toastState.current?.iconColor ?? undefined, [toastState]);

  const { recordToast } = useToastManager();
  useEffect(() => {
    if (toastState.current && toastState.open && toastState.current.message !== undefined) {
      recordToast(toastState.current.message);
    }
  }, [toastState, recordToast]);
  return toastState.current ? (
    <Snackbar
      open={toastState.open}
      key={toastKey + toastState.counter}
      autoHideDuration={toastState.stack.length > 0 ? TOAST_REDUCED_DELAY : TOAST_DELAY}
      TransitionComponent={Fade as TransitionComponent}
      onClose={handleClose}
      sx={{
        ...sx
      }}
    >
      <Box className="ToastContent" data-testid={"ToastContent"}>
        <div className="ToastContentBar" style={{ backgroundColor: barColor }} />
        <div className="ToastContentIconContainer">
          <div className="ToastContentIcon" data-testid={"ToastContentIcon"} style={{ color: iconColor }}>
            {toastState.current.iconRef ? ToastIconLookup[toastState.current.iconRef] : <Info />}
          </div>
        </div>
        <Box className="ToastContentTextContainer">
          <Typography className="ToastContentTitle" data-testid={"ToastContentTitle"}>
            {toastState.current.title}
          </Typography>
          {toastState.current.message && (
            <Typography className="ToastContentMessage" data-testid={"ToastContentMessage"}>
              {toastState.current.message}
            </Typography>
          )}
        </Box>
        <div className="ToastContentIconContainer">
          <div className="ToastContentIcon Close" data-testid={"ToastContentClose"}>
            <Close onClick={handleClose} style={{}} />
          </div>
        </div>
      </Box>
    </Snackbar>
  ) : null;
});
Toast.displayName = "Toast";
