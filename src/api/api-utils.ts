import { z, ZodError } from "zod";
import { getApiUrl } from "../helpers/get-url/get-url";
import { parse as jsonBigIntParse, stringify as jsonBigIntStringify } from "json-bigint";
import { APIRequestError } from "src/redux/api/utils/responseValidator";

type Map = { [k: string]: unknown };

enum ApiEndPoint {
  Dashboard = "Dashboard",
  FileSystem = "FileSystem",
  DataSet = "DataSet"
}

export enum ApiMethod {
  Delete = "DELETE",
  Get = "GET",
  Put = "PUT",
  Post = "POST"
}

type RequestBase = {
  target: string;
  label: string;
};

type Mutation<P extends Map> = RequestBase & {
  method: ApiMethod.Delete | ApiMethod.Post | ApiMethod.Put;
  payload: P;
};

type Request = RequestBase & {
  method: ApiMethod.Get;
};

export const EmptyResponseSchema = z.null();
export type EmptyResponse = z.infer<typeof EmptyResponseSchema>;

type ApiRequestData<R> = (Mutation<Map> | Request) & { schema?: z.ZodType<R> };

export const apiRequestDashboard = async <R extends Map | Map[] | string | string[]>(
  apiRequestData: ApiRequestData<R>,
  noContent?: string
): Promise<R> => apiRequest(apiRequestData, ApiEndPoint.Dashboard, noContent);

export const apiRequestDataSets = async <R>(apiRequestData: ApiRequestData<R>, noContent?: string): Promise<R> =>
  apiRequest(apiRequestData, ApiEndPoint.DataSet, noContent);

export const apiRequestDataSetsWithoutSchema = async <R>(apiRequestData: ApiRequestData<R>): Promise<R> =>
  apiRequestWithoutSchema(apiRequestData, ApiEndPoint.DataSet);

const apiRequest = async <R>(
  apiRequestData: ApiRequestData<R>,
  endpoint: ApiEndPoint,
  noContent?: string
): Promise<R> => {
  const { method, target, label, schema } = apiRequestData;
  const isGet = apiRequestData.method === ApiMethod.Get;
  const url = `${getApiUrl(endpoint)}/${target}`;

  let action = "";
  switch (method) {
    case ApiMethod.Delete:
      action = "delete";
      break;
    case ApiMethod.Put:
      action = "update";
      break;
    case ApiMethod.Post:
      action = "create";
      break;
    case ApiMethod.Get:
      action = "get";
      break;
  }

  const errorPart = `${action} ${label}`;
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(isGet ? {} : { body: jsonBigIntStringify(apiRequestData.payload) })
    });

    if (!response.ok) {
      //const obj = await response.json();

      throw new APIRequestError({
        type: "api_error",
        error: await response.json(),
        status: response.status,
        statusText: response.statusText,
        message: `Response for ${errorPart} is not ok`,
        errorsArray: []
      });
    }

    const text = await response.text();
    if ((response.status === 204 || text === "") && noContent) return JSON.parse(noContent);

    if (schema) {
      try {
        if (!text) {
          return schema.parse(null);
        }
        const result = JSON.parse(text);

        // Note that we are using JSONbig to parse the response
        // to correctly handle large integers.

        // zod is only checking the structure of the response
        // and does not provide the actual data.
        schema.parse(result);
      } catch (e) {
        if (e instanceof ZodError) {
          const message = `Response for ${errorPart} is invalid against schema`;
          throw new APIRequestError({
            type: "zod_error",
            zodError: e.message,
            message,
            errorsArray: [message, e.message]
          });
        }
        if (e instanceof SyntaxError) {
          const message = `Response for ${errorPart} is invalid JSON`;
          throw new APIRequestError({
            type: "syntax_error",
            syntaxError: e as ZodError,
            message: message,
            errorsArray: [message]
          });
        }
      }
    }

    return jsonBigIntParse(text);
  } catch (e) {
    if (e instanceof APIRequestError) throw e;
    const message = `Fetch for ${errorPart} failed`;
    throw new APIRequestError({
      type: "fetch_error",
      error: e,
      message,
      errorsArray: [message]
    });
  }
};

const apiRequestWithoutSchema = async <R>(apiRequestData: ApiRequestData<R>, endpoint: ApiEndPoint): Promise<R> => {
  const { method, target, label } = apiRequestData;
  const isGet = apiRequestData.method === ApiMethod.Get;
  const url = `${getApiUrl(endpoint)}/${target}`;

  let action = "";
  switch (method) {
    case ApiMethod.Delete:
      action = "delete";
      break;
    case ApiMethod.Put:
      action = "update";
      break;
    case ApiMethod.Post:
      action = "create";
      break;
    case ApiMethod.Get:
      action = "get";
      break;
  }

  const errorPart = `${action} ${label}`;
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(isGet ? {} : { body: jsonBigIntStringify(apiRequestData.payload) })
    });

    if (!response.ok) {
      throw new APIRequestError({
        type: "api_error",
        error: await response.json(),
        status: response.status,
        statusText: response.statusText,
        message: `Response for ${errorPart} is not ok`,
        errorsArray: []
      });
    }
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      if (e instanceof ZodError) {
        const message = `Response for ${errorPart} is invalid against schema`;
        throw new APIRequestError({
          type: "zod_error",
          zodError: e.message,
          message,
          errorsArray: [message, e.message]
        });
      }
      if (e instanceof SyntaxError) {
        const message = `Response for ${errorPart} is invalid JSON`;
        throw new APIRequestError({
          type: "syntax_error",
          syntaxError: e as ZodError,
          message: message,
          errorsArray: [message]
        });
      }
      throw e;
    }
  } catch (e) {
    if (e instanceof APIRequestError) throw e;
    const message = `Fetch for ${errorPart} failed`;
    throw new APIRequestError({
      type: "fetch_error",
      error: e,
      message,
      errorsArray: [message]
    });
  }
};
