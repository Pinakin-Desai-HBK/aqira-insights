import { formatNumberForUI } from "./format-number";
import { describe, expect, test } from "vitest";

describe("formatNumberForUI", () => {
  test("should return same value if passed a non-number", () => {
    expect(formatNumberForUI("fred")).toEqual("fred");
  });

  // Integer

  test("should return the correct value if passed '1'", () => {
    expect(formatNumberForUI("1")).toEqual("1");
  });

  test("should return the correct value if passed '9999'", () => {
    expect(formatNumberForUI("9999")).toEqual("9999");
  });

  test("should return the correct value if passed '10000'", () => {
    expect(formatNumberForUI("10000")).toEqual("1e4");
  });

  // Double

  test("should return the correct value if passed '1.0'", () => {
    expect(formatNumberForUI("1.0")).toEqual("1");
  });

  test("should return the correct value if passed '1.1'", () => {
    expect(formatNumberForUI("1.1")).toEqual("1.1");
  });

  test("should return the correct value if passed '1.001'", () => {
    expect(formatNumberForUI("1.001")).toEqual("1.001");
  });

  test("should return the correct value if passed '9999.1'", () => {
    expect(formatNumberForUI("9999.1")).toEqual("9999.1");
  });

  test("should return the correct value if passed '10000.1'", () => {
    expect(formatNumberForUI("10000.1")).toEqual("1.00001e4");
  });
});
