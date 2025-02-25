import { createContext } from "react";
import { DialogContextData } from "src/redux/types/ui/dialogs";

export const DialogContext = createContext<DialogContextData>(null!);
