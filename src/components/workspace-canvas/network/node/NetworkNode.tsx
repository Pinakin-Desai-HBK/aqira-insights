import { Card, Box, Grid2 } from "@mui/material";
import { NodeProps, Position, useReactFlow } from "reactflow";
import NetworkNodeHandles from "../node-handles/NetworkNodeHandles";
import { InlineEdit } from "../../../inline-edit/InlineEdit";
import { NetworkNodeDataUI } from "src/redux/types/ui/networkNodes";
import { useNetworkNode } from "./useNetworkNode";
import { NodeAdornment } from "./adornments/NodeAdornment";

const NetworkNode = ({ id, data, selected }: NodeProps<NetworkNodeDataUI>) => {
  const { onDrop, onDragOver, validationHandler, onNameUpdate, editing, setEditing } = useNetworkNode(id, data);
  const { getZoom } = useReactFlow();
  const isTemp = id === "new_node";
  const size = isTemp ? 75 / getZoom() : 75;

  return data ? (
    <div
      data-testid={"AI-node-" + data.name}
      data-id={id}
      id={id}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: isTemp ? (75 - size) / 2 : 0,
        left: isTemp ? (75 - size) / 2 : 0,
        position: "relative",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "column",
        ...(isTemp
          ? {
              pointerEvents: "none"
            }
          : {})
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <Grid2 display="flex" justifyContent="center" alignItems="center">
        <Card
          data-testid={"AI-node-circle-" + data.name}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex"
          }}
          sx={{ boxShadow: selected ? "inset 0px 0px 0px 2px #00008080" : 0 }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              width: 0.9,
              height: 0.9,
              border: 5,
              borderColor: isTemp ? "#00000000" : data.color
            }}
            justifyContent="center"
            alignItems="center"
            display="flex"
          >
            <NetworkNodeHandles
              nodeName={data.name}
              ports={data.inputPorts}
              position={Position.Left}
            ></NetworkNodeHandles>
            <NetworkNodeHandles
              nodeName={data.name}
              ports={data.outputPorts}
              position={Position.Right}
            ></NetworkNodeHandles>
            {data.icon && (
              <img
                data-testid={"AI-node-icon-" + data.name}
                src={`data:image/svg+xml;base64,${btoa(data.icon)}`}
                height="40px"
                width="40px"
              />
            )}
            <NodeAdornment data={data} id={id} />
          </Box>
        </Card>
      </Grid2>
      <Box
        data-testid={"AI-node-label-" + data.name}
        style={{
          ...(isTemp ? { display: "none" } : {})
        }}
        sx={{
          maxWidth: "250px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          position: "fixed",
          top: "100%",
          border: "1px solid #bdbdbd",
          backgroundColor: "#FFF",
          padding: "2px 7px 2px 7px",
          fontSize: "12px",
          borderRadius: "12px",
          zIndex: -1
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
      >
        <InlineEdit
          textColor="black"
          value={data.name}
          validator={validationHandler}
          blockStart={true}
          setEditing={setEditing}
          onUpdate={onNameUpdate}
          editing={editing}
          dataTestId="NodeNameInput"
          maxWidth={232}
          sx={{ "& .MuiInput-input": { fontSize: "12px", paddingTop: "1px", lineHeight: "24px" } }}
        />
      </Box>
    </div>
  ) : null;
};

export default NetworkNode;
