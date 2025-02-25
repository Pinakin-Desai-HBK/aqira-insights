import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PopoutPlaceholder from "../../../assets/svg/popout-placeholder.svg";
import { Icon } from "../../icon/Icon";
import { popoutDetails } from "src/popoutDetails";

export const WorkspacePlaceholder = ({ closePopoutHandler }: { closePopoutHandler: () => void }) => {
  const { isPopout } = popoutDetails;

  return (
    <Box
      sx={{
        paddingBottom: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "50px",
        height: "100%",
        backgroundColor: "#F9FCFF"
      }}
    >
      {isPopout ? null : (
        <Icon src={PopoutPlaceholder} style={{ width: "250px", height: "50%", padding: "2px" }} inverted={false} />
      )}
      <Typography
        sx={{
          width: "320px",
          fontSize: "1rem",
          color: "#949495",
          fontWeight: "bold"
        }}
      >
        This page has been detached into a separate view.
        <a
          data-testid="ClosePopoutButton"
          style={{
            cursor: "pointer",
            padding: "0 5px",
            fontSize: "1rem",
            color: "#00457B",
            fontWeight: "bold",
            textDecoration: "underline"
          }}
          onClick={function () {
            closePopoutHandler();
            return false;
          }}
        >
          Click
        </a>
        here to reattach it.
      </Typography>
    </Box>
  );
};
