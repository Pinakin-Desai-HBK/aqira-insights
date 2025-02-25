import { ErrorDetails } from "./responseValidator";

export const isErrorDetails = (result: unknown): result is ErrorDetails => {
  return (
    result !== null &&
    typeof result === "object" &&
    "type" in result &&
    typeof result.type === "string" &&
    ["zod_error", "api_error", "syntax_error"].indexOf(result.type) > -1
  );
};
