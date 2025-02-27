import { Workspace } from "src/react/redux/types/schemas/project";

export const getLabelPart = (type: Workspace["type"]) => (type === "Network" ? "Network" : "Dashboard");
