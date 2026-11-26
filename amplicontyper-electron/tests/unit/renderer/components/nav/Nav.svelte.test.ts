import { render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";
import Nav from "../../../../../src/renderer/src/components/nav/Nav.svelte";

const { mockRouter } = vi.hoisted(() => {
  const mockRouter = {
    path: "/",
    navigate: vi.fn()
  };
  return { mockRouter };
});

vi.mock("svelte-tiny-router", () => ({
  useTinyRouter: () => mockRouter
}));

describe("Nav", () => {
  let user;
  beforeEach(() => {
    mockRouter.path = "/";
    user = userEvent.setup();
  });

  test("renders as expected", async () => {
    render(Nav);
    expect(screen.getByText("AmpliconTyper")).toBeVisible();
    expect(screen.getByTestId("nav-about")).toHaveTextContent("About");
    expect(screen.getByTestId("nav-run")).toHaveTextContent("Run");
  });

  test("navigates to home on load", async () => {
    render(Nav);
    await tick(); // Wait for navigation
    expect(mockRouter.navigate).toHaveBeenCalledWith("/");
  });

  test("navigates to run on click run link", async () => {
    mockRouter.path = "/test";
    render(Nav);
    await user.click(screen.getByTestId("nav-run"));
    expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
    expect(mockRouter.navigate.mock.calls[1]).toStrictEqual(["/"]);
  });

  test("navigate to about on click about link", async () => {
    render(Nav);
    await user.click(screen.getByTestId("nav-about"));
    expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
    expect(mockRouter.navigate.mock.calls[1]).toStrictEqual(["/about"]);
  });
});
