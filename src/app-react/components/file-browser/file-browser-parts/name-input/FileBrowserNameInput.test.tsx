import { Mock, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FileBrowserNameInput } from "./FileBrowserNameInput";
import { ThemeProvider } from "@mui/material";
import { themeAILight } from "../../../../redux/types/ui/themes";

const doRender = (errorMessage: string = ""): { container: HTMLElement; onChange: Mock } => {
  const onChange = vi.fn();

  const { container } = render(
    <ThemeProvider theme={themeAILight}>
      <FileBrowserNameInput
        errorMessage={errorMessage}
        label="File name"
        value="abc.apj"
        onChange={onChange}
        handleConfirm={vi.fn()}
      />
    </ThemeProvider>
  );

  return { container, onChange };
};

describe("FileBrowserFileList", () => {
  it("should have the correct input value", () => {
    doRender();

    const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;

    expect(nameInput).toHaveValue("abc.apj");
  });

  it("should have the correct label", () => {
    doRender();

    const label = screen.getByTestId("AI-file-browser-name-input-label");

    expect(label.innerHTML).toEqual("File name:");
  });

  it("should call onChange when the value is changed", () => {
    const { onChange } = doRender();

    const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
    fireEvent.change(nameInput, { target: { value: "xyz.txt" } });

    expect(onChange).toHaveBeenCalled();
  });

  it("should not show an error message if there isn't one", () => {
    doRender();

    const errorMessage = screen.getByTestId("AI-file-browser-name-textfield").querySelector("p")!;

    expect(errorMessage).toBeNull();
  });

  it("should not show an error message if there isn't one", () => {
    doRender("File does not exist");

    const errorMessage = screen.getByTestId("AI-file-browser-name-textfield").querySelector("p")!;

    expect(errorMessage.innerHTML).toEqual("File does not exist");
  });
});
