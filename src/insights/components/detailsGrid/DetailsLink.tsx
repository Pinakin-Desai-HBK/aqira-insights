import { DetailsHeading } from "./DetailsHeading";

export const DetailsLink = ({ label }: { label: string }) => (
  <DetailsHeading
    heading={label}
    sx={{
      textDecoration: "underline",
      cursor: "pointer",
      color: "#055B9D",
      "&:hover": { color: "#4ba9f1", fontWeight: "800" }
    }}
  />
);
