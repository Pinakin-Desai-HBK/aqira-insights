import { GridColumnMenu } from "@mui/x-data-grid/components/menu/columnMenu/GridColumnMenu";
import { GridColumnMenuProps } from "@mui/x-data-grid/components/menu/columnMenu/GridColumnMenuProps";

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
