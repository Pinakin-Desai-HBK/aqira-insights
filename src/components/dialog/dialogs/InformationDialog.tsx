import BaseDialog from "../support/BaseDialog";
import { Box, Stack, useTheme } from "@mui/material";
import AboutPanelAccordion from "../../about-dialog/about-dialog-parts/AboutPanelAccordion";
import { InformationDialogParams, InformationItemContent } from "src/redux/types/ui/dialogs";

const InformationDialogContents = ({ content }: { content: InformationItemContent<number> }) => {
  const theme = useTheme().palette.properties;
  return (
    <Box
      style={{
        gridTemplateColumns: content.rowTemplate.join(" "),
        color: theme.text,
        display: "grid",
        gap: "10px",
        padding: "0px 8px"
      }}
      fontSize="small"
    >
      {content.rows.map((row) => {
        return row.map((cell, index) => {
          return <div key={index}>{cell}</div>;
        });
      })}
    </Box>
  );
};

const InformationDialog = (props: InformationDialogParams) => {
  const { contents } = props;

  return (
    <BaseDialog
      contentSx={{ padding: "0", backgroundColor: "#E8E8E8" }}
      messageSx={{ paddingLeft: "0" }}
      {...props}
      close={props.onOk}
      buttons={[
        {
          callback: props.onOk,
          label: props.okLabel || "OK",
          disabled: false,
          testidSuffix: "ok-button"
        }
      ]}
    >
      <Stack data-testid="AI-information-dialog-panel" style={{ margin: "8px 0px", gap: "8px" }}>
        {contents.map((item, index) => {
          switch (item.type) {
            case "heading":
              return (
                <h2 key={index} className="InformationDialogHeading">
                  {item.heading}
                </h2>
              );
            case "content": {
              return (
                <div key={index} className="InformationDialogContent">
                  <InformationDialogContents content={item.content} />
                </div>
              );
            }
            case "contentWithHeading": {
              return (
                <AboutPanelAccordion
                  key={index}
                  headingText={item.heading}
                  content={<InformationDialogContents content={item.content} />}
                  name={item.heading}
                  idPrefix="AI-information-dialog-content-"
                  sx={{ margin: "0px 8px" }}
                />
              );
            }
          }
        })}
      </Stack>
    </BaseDialog>
  );
};
InformationDialog.displayName = "InformationDialog" as const;

export default InformationDialog;
