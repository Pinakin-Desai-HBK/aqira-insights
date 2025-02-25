import { Workspace } from "src/redux/types/schemas/project";

export const getLabelPart = (type: Workspace["type"]) => (type === "Network" ? "Network" : "Dashboard");
