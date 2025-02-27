import { describe, expect, test } from "vitest";
import { getApiUrl } from "./get-url";

describe("getApiUrl", () => {
  test("should return the correct url in dev mode", () => {
    expect(getApiUrl("Nodetype")).toEqual("http://localhost:5042/api/v1/Nodetype");
  });
});
