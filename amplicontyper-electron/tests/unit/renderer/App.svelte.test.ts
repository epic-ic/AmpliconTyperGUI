import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, beforeEach } from "vitest";
import App from "../../../src/renderer/src/App.svelte";
import {mockAmpliconTyperAPI} from "../MockAmpliconTyperAPI.svelte";

describe("App", () => {

  const expectRunPage = async () => {
      expect(screen.getByText("New Run")).toBeVisible();
  };

  beforeEach(() => {
      mockAmpliconTyperAPI({});
  });

  test("renders as expected and routes to About and Run", async () => {
      render(App);
      expect(screen.getByText("AmpliconTyper")).toBeInTheDocument();
      expectRunPage();

      await userEvent.click(screen.getByTestId("nav-about"));
      await waitFor(() => {
          expect(screen.getByText("About AmpliconTyper")).toBeVisible();
      });

      await userEvent.click(screen.getByTestId("nav-run"));
      await waitFor(() => {
            expectRunPage();
      });
  });
});