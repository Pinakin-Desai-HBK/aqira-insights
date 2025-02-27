import { createContext } from "react";
import { DialogContextData } from "src/react/redux/types/ui/dialogs";

export const DialogContext = createContext<DialogContextData>(null!);
