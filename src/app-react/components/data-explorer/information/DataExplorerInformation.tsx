import Typography from "@mui/material/Typography";

export const DataExplorerInformation = ({ text }: { text: string }) => (
  <Typography color="white" marginTop={1} fontSize="small" data-testid={"AI-data-explorer-information"}>
    {text}
  </Typography>
);
