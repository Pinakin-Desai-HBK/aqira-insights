import { describe, expect, it } from "vitest";
import { ensureProjectFileExtension } from "./ensure-project-file-extension";

describe("ensureProjectFileExtension", () => {
  it("should add the project file extension if it is missing", () => {
    expect(ensureProjectFileExtension("/path/to/file")).toEqual("/path/to/file.apj");
  });

  it("should not add the project file extension if it is already present", () => {
    expect(ensureProjectFileExtension("/path/to/file.apj")).toEqual("/path/to/file.apj");
  });

  it("should handle filepaths with multiple dots correctly", () => {
    expect(ensureProjectFileExtension("/path/to/file.with.dots")).toEqual("/path/to/file.with.dots.apj");
  });

  it("should handle filepaths ending with a dot correctly", () => {
    expect(ensureProjectFileExtension("/path/to/file-without-extension.")).toEqual(
      "/path/to/file-without-extension..apj"
    );
  });

  it("should handle filepaths with an extension that is variation of the correct file extension correctly", () => {
    expect(ensureProjectFileExtension("/path/to/file.APJ")).toEqual("/path/to/file.APJ");
  });
});
