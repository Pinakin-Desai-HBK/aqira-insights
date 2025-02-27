import { memo } from "react";
import { useProperties } from "src/react/redux/hooks/useProperties";
import { NetworkNodeDataUI } from "src/react/redux/types/ui/networkNodes";
import { AdornmentMap } from "./AdornmentMap";

export const NodeAdornment = memo(({ data, id }: { data: NetworkNodeDataUI; id: string }) => {
  const properties = useProperties(data.identifier);

  const entry = AdornmentMap[data.type];
  if (!entry || !properties) return null;

  const property = properties[entry.propertyName];
  if (!property) return null;

  if (entry.condition && !entry.condition(properties)) return null;

  const value = entry.processProperty(property.value);
  return <entry.adornment value={value} id={id} tooltip={entry.tooltip} />;
});
NodeAdornment.displayName = "NodeAdornment";
