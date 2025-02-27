import { render, fireEvent } from "@testing-library/react";
import { TablePagination } from "./TablePagination";
import { describe, expect, it, vi } from "vitest";
import { TablePaginationData } from "src/react/redux/types/ui/table";

describe("TablePagination", () => {
  const defaultProps: TablePaginationData = {
    firstItemIndex: 1,
    lastItemIndex: 10,
    nextisEnabled: true,
    prevIsEnabled: true,
    totalNumberOfItems: 100,
    onPageChange: vi.fn()
  };

  it("renders correctly", () => {
    const { getByText } = render(<TablePagination {...defaultProps} />);
    expect(getByText("1–10 of 100")).toBeInTheDocument();
  });

  it("disables previous button when prevIsEnabled is false", () => {
    const { getByTestId } = render(<TablePagination {...defaultProps} prevIsEnabled={false} />);
    const prevButton = getByTestId("AI-table-prev");
    expect(prevButton).toBeDisabled();
  });

  it("disables next button when nextisEnabled is false", () => {
    const { getByTestId } = render(<TablePagination {...defaultProps} nextisEnabled={false} />);
    const nextButton = getByTestId("AI-table-next");
    expect(nextButton).toBeDisabled();
  });

  it("calls onPageChange with 'first' when first page button is clicked", () => {
    const { getByTestId } = render(<TablePagination {...defaultProps} />);
    const firstPageButton = getByTestId("AI-table-first");
    fireEvent.click(firstPageButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith("first");
  });

  it("calls onPageChange with 'last' when last page button is clicked", () => {
    const { getByTestId } = render(<TablePagination {...defaultProps} />);
    const lastPageButton = getByTestId("AI-table-last");
    fireEvent.click(lastPageButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith("last");
  });

  it("calls onPageChange with 'next' when next page button is clicked", () => {
    const { getByTestId } = render(<TablePagination {...defaultProps} />);
    const nextPageButton = getByTestId("AI-table-next");
    fireEvent.click(nextPageButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith("next");
  });

  it("calls onPageChange with 'prev' when previous page button is clicked", () => {
    const { getByTestId } = render(<TablePagination {...defaultProps} />);
    const prevPageButton = getByTestId("AI-table-prev");
    fireEvent.click(prevPageButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith("prev");
  });
});
