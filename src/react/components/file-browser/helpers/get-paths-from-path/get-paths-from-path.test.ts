import { describe, expect, it } from "vitest";
import { getPathsFromPath } from "./get-paths-from-path";

describe("getPathsFromPath", () => {
  it("should return the correct value for empty path", () => {
    expect(getPathsFromPath("")).toEqual([""]);
  });

  it("should return the correct value for a drive", () => {
    expect(getPathsFromPath("C:\\")).toEqual(["", "C:\\"]);
  });

  it("should return the correct value for a path", () => {
    expect(getPathsFromPath("C:\\ABC")).toEqual(["", "C:\\", "C:\\ABC"]);
  });
});
