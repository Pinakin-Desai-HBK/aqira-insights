import { GridColumnMenu, GridColumnMenuProps } from "@mui/x-data-grid";

const LogPanelColumnMenu = (props: GridColumnMenuProps) => {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        columnMenuColumnsItem: null,
        columnMenuFilterItem: null
      }}
    />
  );
};

export default LogPanelColumnMenu;
