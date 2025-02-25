import { LOG_MESSAGES_LIMIT } from "src/consts/consts";
import { LogMessageArray } from "src/redux/types/schemas/logMessage";

export const checkMessages = (messages: LogMessageArray): LogMessageArray => {
  if (messages.length > LOG_MESSAGES_LIMIT) messages.splice(LOG_MESSAGES_LIMIT, messages.length - LOG_MESSAGES_LIMIT);
  return messages;
};
