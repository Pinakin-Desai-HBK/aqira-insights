import { LOG_MESSAGES_LIMIT } from "src/insights/consts/consts";
import { LogMessageArray } from "src/insights/redux/types/schemas/logMessage";

export const checkMessages = (messages: LogMessageArray): LogMessageArray => {
  if (messages.length > LOG_MESSAGES_LIMIT) messages.splice(LOG_MESSAGES_LIMIT, messages.length - LOG_MESSAGES_LIMIT);
  return messages;
};
