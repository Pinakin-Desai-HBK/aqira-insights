import { Workspace } from "src/insights/redux/types/schemas/project";

export const getLabelPart = (type: Workspace["type"]) => (type === "Network" ? "Network" : "Dashboard");
