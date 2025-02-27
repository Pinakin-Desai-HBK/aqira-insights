import { createContext } from "react";
import { DialogContextData } from "src/insights/redux/types/ui/dialogs";

export const DialogContext = createContext<DialogContextData>(null!);
