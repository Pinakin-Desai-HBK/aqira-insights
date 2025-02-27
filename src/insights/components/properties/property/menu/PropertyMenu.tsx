import MoreVert from "@mui/icons-material/MoreVert";
import { MenuButton } from "../../../menu/MenuButton";
import { memo, useCallback, useMemo } from "react";
import { usePropertyUtils } from "../usePropertyUtils";
import { MenuActionHandler } from "src/insights/redux/types/actions";
import { createPropertyMenuItems } from "./propertyMenuUtils";
import { Property } from "src/insights/redux/types/schemas/properties";
import { PropertyParams } from "src/insights/redux/types/ui/properties";

const PropertyMenu = memo((params: PropertyParams<Property>) => {
  const { propertyFieldProps, property } = params;
  const isExpression = propertyFieldProps.supportsExpression && property.setting === "Expression";
  const { switchToExpression, switchToValue, openExpressionEditor } = usePropertyUtils(params);
  const handler: MenuActionHandler = useCallback<MenuActionHandler>(
    ({ type }) => {
      switch (type) {
        case "SwitchExpressionAction": {
          switchToExpression(propertyFieldProps.name);
          break;
        }
        case "SwitchValueAction": {
          switchToValue(propertyFieldProps.name);
          break;
        }
        case "EditExpressionAction": {
          if (openExpressionEditor) openExpressionEditor();
          break;
        }
      }
    },
    [openExpressionEditor, switchToExpression, switchToValue, propertyFieldProps.name]
  );
  const menuItems = useMemo(() => createPropertyMenuItems(handler, isExpression), [handler, isExpression]);

  return (
    <div style={{ width: "10px", minWidth: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <MenuButton
        dataTestId={`AI-proprty-menu-${params.propertyFieldProps.name}`}
        id={`AI-proprty-menu-${params.propertyFieldProps.name}`}
        items={menuItems}
        prefix=""
        disableRipple={true}
        sxButton={{
          width: "10px",
          minWidth: "10px",
          overflow: "hidden",
          color: "#47505C",
          "&:focus": { color: "#5adbd6" }
        }}
        openElement={<MoreVert width="10px" style={{ cursor: "pointer", padding: "0", height: "18px" }} />}
      />
    </div>
  );
});
PropertyMenu.displayName = "PropertyMenu";

export default PropertyMenu;
