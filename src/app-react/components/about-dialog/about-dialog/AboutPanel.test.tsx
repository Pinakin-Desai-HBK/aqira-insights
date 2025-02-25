import { render, within } from "@testing-library/react";
import AboutPanel from "./AboutPanel";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppTestWrapper from "../../../../vite-test/AppTestWrapper";

const doRender = () => {
  return render(
    <AppTestWrapper>
      <AboutPanel />
    </AppTestWrapper>
  );
};

describe("AboutPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should display the correct copywrite content", () => {
    vi.setSystemTime(new Date(2024, 1));

    const { getByTestId } = doRender();

    const container = getByTestId("AI-about-panel-section-Copyright");

    expect(within(container).getByText("Copyright")).toBeInTheDocument();
    expect(within(container).getByText("Copyright Hottinger Bruel & Kjaer UK Ltd 2024")).toBeInTheDocument();
  });

  it("should display the correct software version", () => {
    const { getByTestId } = doRender();

    const container = getByTestId("AI-about-panel-section-SoftwareVersion");

    expect(within(container).getByText("Software version - 2024 R1")).toBeInTheDocument();
    expect(within(container).getByText("Test Product")).toBeInTheDocument();
    expect(within(container).getByText("3.1.0")).toBeInTheDocument();
    expect(within(container).getByText("Test Component")).toBeInTheDocument();
    expect(within(container).getByText("2.1.0")).toBeInTheDocument();
  });

  it("should display the correct third party licenses content", () => {
    const { getByTestId } = doRender();

    const container = getByTestId("AI-about-panel-section-ThirdPartyLicenses");

    expect(within(container).getByText("Third party licenses")).toBeInTheDocument();
    expect(
      within(container).getByText(
        `Further information about the components used, including the license text, can be found in the folder labelled "About" of the installation directory of this software.`
      )
    ).toBeInTheDocument();
  });

  it("should display the correct contact us content", () => {
    const { getByTestId } = doRender();

    const container = getByTestId("AI-about-panel-section-ContactUs");

    expect(within(container).getByText("Contact us")).toBeInTheDocument();
    expect(within(container).getByRole("link", { name: "hbkworld.com/en/products/software" })).toHaveAttribute(
      "href",
      "https://www.hbkworld.com/en/products/software"
    );
    expect(within(container).getByRole("link", { name: "support website" })).toHaveAttribute(
      "href",
      "https://www.hbkworld.com/en/services-support/support"
    );
    expect(within(container).getByText(/Visit our website at/)).toBeInTheDocument();
    expect(within(container).getByText(/. Report bugs or ask further questions to our/)).toBeInTheDocument();
  });
});
