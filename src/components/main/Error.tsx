import { Box, Button } from "@mui/material";

// import { useErrorBoundary } from "react-error-boundary";

/**
 *  Use in async code to throw an error to the error boundary
 *
 *  const { throwAsyncError } = useThrowAsyncError();
 *  ...
 *  onClick={() => {
 *     throwAsyncError(new Error("Error"));
 *  }}
 */
export const ErrorFallback = ({ error }: { error: Error }) => {
  //const { resetBoundary } = useErrorBoundary();

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh"
      }}
    >
      <Box
        role="alert"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh"
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh"
          }}
        >
          <p>Something went wrong:</p>
          <pre style={{ color: "red", maxWidth: "80%", textWrap: "wrap" }}>{error.message}</pre>
          <pre style={{ color: "red", maxWidth: "80%", overflow: "scroll" }}>{error.stack}</pre>
          {/*<Button onClick={resetBoundary}>Try again</Button>*/}
          <Button
            onClick={() => {
              document.location.reload();
            }}
            variant="contained"
          >
            Reload
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
