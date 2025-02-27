const RootURL = import.meta.env.DEV ? "http://localhost:5042" : "";

export const getApiBaseUrl = (): string => {
  return `${RootURL}/api/v1/`;
};
