import { describe, expect, test, beforeAll, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import FileSelect from "../../../../../src/renderer/src/components/forms/FileSelect.svelte";

const expectChooseFolder = async (): Promise<void> => {
  expect(screen.getByText("Choose folder")).toBeVisible();
};

const expectChooseFile = async (): Promise<void> => {
  expect(screen.getByText("Choose file")).toBeVisible();
};

const mockOnChange = vi.fn();

describe("FileSelect", () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  test("renders as expected for folder select", async () => {
    render(FileSelect, {
      props: {
        selectFolder: true,
        save: false,
        filters: [],
        value: "/default"
      }
    });
    await expectChooseFolder();
    expect(screen.getByText("/default")).toBeVisible();
  });

  test("renders as expected for file select", async () => {
    render(FileSelect, {
      props: {
        selectFolder: false,
        save: false,
        filters: [],
        value: "/default/report.html"
      }
    });
    await expectChooseFile();
    expect(screen.getByText("/default/report.html")).toBeVisible();
  });

  test("shows open file dialog, updates values and calls onchange", async () => {
    const mockShowOpenFileDialog = vi.fn().mockImplementation(() => "/selected/report.html");
    window.api = {
      showOpenFileDialog: mockShowOpenFileDialog
    };
    render(FileSelect, {
      props: {
        title: "Test Title",
        selectFolder: false,
        save: false,
        filters: [{ name: "html", extensions: ["html"] }],
        onchange: mockOnChange,
        value: "/default/report.html"
      }
    });

    const button = screen.getByRole("button");
    await user.click(button);
    expect(mockShowOpenFileDialog).toHaveBeenCalledWith({
      title: "Test Title",
      selectFolder: false,
      filters: [{ name: "html", extensions: ["html"] }],
      defaultPath: "/default/report.html"
    });

    expect(mockOnChange).toHaveBeenCalledOnce();
    expect(screen.getByText("/selected/report.html")).toBeVisible();
  });

  test("shows save file dialog, updates values and calls onchange", async () => {
    const mockShowSaveFileDialog = vi.fn().mockImplementation(() => "/selected/newReport.html");
    window.api = {
      showSaveFileDialog: mockShowSaveFileDialog
    };
    render(FileSelect, {
      props: {
        title: "Test Title",
        selectFolder: false,
        save: true,
        filters: [{ name: "html", extensions: ["html"] }],
        onchange: mockOnChange,
        value: "/default/report.html"
      }
    });

    const button = screen.getByRole("button");
    await user.click(button);
    expect(mockShowSaveFileDialog).toHaveBeenCalledWith({
      title: "Test Title",
      filters: [{ name: "html", extensions: ["html"] }],
      defaultPath: "/default/report.html"
    });

    expect(mockOnChange).toHaveBeenCalledOnce();
    expect(screen.getByText("/selected/newReport.html")).toBeVisible();
  });

  test("does no update if dialog is cancelled", async () => {
    const mockShowOpenFileDialog = vi.fn().mockImplementation(() => null);
    window.api = {
      showOpenFileDialog: mockShowOpenFileDialog
    };
    render(FileSelect, {
      props: {
        title: "Test Title",
        selectFolder: false,
        save: false,
        filters: [{ name: "html", extensions: ["html"] }],
        onchange: mockOnChange,
        value: "/default/report.html"
      }
    });

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnChange).not.toHaveBeenCalled();
    expect(screen.getByText("/default/report.html")).toBeVisible();
  });
});
