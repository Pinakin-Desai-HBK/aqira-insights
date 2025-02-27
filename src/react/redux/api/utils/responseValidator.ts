import { z, ZodError } from "zod";
import { parse as jsonBigIntParse } from "json-bigint";
import { ResponseHandlerParams } from "../../types/redux/redux";

export type ErrorDetails = { errorsArray: string[] | null } & (
  | {
      message: string;
      type: "zod_error";
      zodError: string;
    }
  | {
      message: string;
      type: "syntax_error";
      syntaxError: SyntaxError;
    }
  | {
      message: string;
      type: "api_error";
      error:
        | {
            type: string;
            title: string;
            status: number;
            errors?: { [key: string]: string };
            detail?: string;
          }
        | string;
      status: number;
      statusText: string;
    }
  | {
      message: string;
      type: "fetch_error";
      error: unknown;
    }
);

export class APIRequestError {
  details: ErrorDetails;

  constructor(details: ErrorDetails) {
    this.details = details;
    details.errorsArray = [];
    switch (details.type) {
      case "api_error": {
        const { error, message } = details;
        if (error && typeof error === "object") {
          const { errors, detail } = error;
          if (errors)
            details.errorsArray = Object.keys(errors).reduce((arr, key) => {
              const str = errors[key];
              return str !== undefined ? [...arr, str] : arr;
            }, [] as string[]);
          if (detail) details.errorsArray.push(detail);
        } else {
          details.errorsArray.push(error);
        }
        if (message) details.errorsArray.push(message);
        break;
      }
      case "fetch_error": {
        const { error, message } = details;
        details.errorsArray = [message, JSON.stringify(error)];
        break;
      }
      case "syntax_error": {
        const {
          message,
          syntaxError: { message: errorMessage }
        } = details;
        details.errorsArray = [message, errorMessage];
        break;
      }
      case "zod_error": {
        const {
          message
          //zodError: { message: errorMessage }
        } = details;
        details.errorsArray = [message]; //, errorMessage];
      }
    }
  }
}

export type APIError = APIRequestError["details"];

export const responseValidator = async <R, J extends boolean>({
  response,
  schema,
  actionLabel,
  returnText
}: ResponseHandlerParams<R, J>): Promise<ValidateResponseResult<R, J> | APIError> => {
  const status = response.status;
  if (!response.ok) {
    return new APIRequestError({
      type: "api_error",
      error: await response.json(),
      status: response.status,
      statusText: response.statusText,
      message: `Response is not ok`,
      errorsArray: []
    }).details;
  }
  const text = await response.text();
  const result = validateResponse<R, J>(text, status, schema, actionLabel, returnText);
  return result;
};

type ValidateResponseResult<R, J extends boolean> = APIError | (J extends true ? string : R);

type ValidateResponse = <R, J extends boolean>(
  text: string,
  status: number,
  schema: z.ZodType<R, z.ZodTypeDef, R> | undefined,
  actionLabel: string,
  returnText?: J,
  noContent?: string
) => ValidateResponseResult<R, J>;

const validateResponse: ValidateResponse = <R, J extends boolean>(
  text: string,
  status: number,
  schema: z.ZodType<R, z.ZodTypeDef, R> | undefined,
  actionLabel: string,
  returnText?: J,
  noContent?: string
): ValidateResponseResult<R, J> => {
  if ((status === 204 || text === "") && noContent) {
    return JSON.parse(noContent);
  }
  const errorPart = `${actionLabel}`;
  if (schema) {
    try {
      if (!text) {
        return schema.parse(null) as ValidateResponseResult<R, J>;
      }
      schema.parse(JSON.parse(text));
    } catch (e) {
      if (e instanceof ZodError) {
        const message = `Response for ${errorPart} is invalid against schema`;
        return new APIRequestError({
          type: "zod_error",
          zodError: e.message,
          message,
          errorsArray: [message, e.message]
        }).details;
      }
      if (e instanceof SyntaxError) {
        const message = `Response for ${errorPart} is invalid JSON`;
        return new APIRequestError({
          type: "syntax_error",
          syntaxError: e as SyntaxError,
          message: message,
          errorsArray: [message]
        }).details;
      }
    }
  }
  const result: ValidateResponseResult<R, J> = returnText ? text : jsonBigIntParse(text);
  return result;
};
