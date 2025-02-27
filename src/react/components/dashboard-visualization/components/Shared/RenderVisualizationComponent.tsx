import { memo, useContext } from "react";
import styles from "./RenderVisualizationComponent.module.css";
import { useConnectVisualization } from "../../hooks/useConnectVisualization";
import { VisualizationDetailsContext } from "../../context/VisualizationDetailsContext";
import { JSX } from "react";
import Box from "@mui/material/Box";

export const RenderVisualizationComponent = memo(
  (props: { children: JSX.Element; show: boolean; errorMessage: string | null; visTypeName: string }) => {
    const { onDragOver, onDrop } = useConnectVisualization();
    return (
      <Box
        onDrop={onDrop}
        onDragOver={onDragOver}
        sx={{
          height: "100%",
          width: "100%",
          pointerEvents: "auto"
        }}
        overflow="hidden"
      >
        {props.show && !props.errorMessage ? (
          <>
            <Box className={`VisualizationContainer`}>
              <Box className={`Container`}>{props.children}</Box>
            </Box>
          </>
        ) : (
          <VisOverLay message={`${props.errorMessage}`} />
        )}
      </Box>
    );
  }
);
RenderVisualizationComponent.displayName = "RenderVisualizationComponent";

export const VisOverLay = ({ message }: { message: string }) => {
  const { name } = useContext(VisualizationDetailsContext); // as VisualizationDetails<Histogram3DKey>;
  return (
    <div
      data-testid={`vis-overlay-${name}`}
      style={{
        top: "0px",
        left: "0px",
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        padding: "10px",
        zIndex: 1002
      }}
    >
      {message}
    </div>
  );
};
