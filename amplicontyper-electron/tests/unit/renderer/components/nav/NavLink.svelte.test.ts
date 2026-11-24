import { screen, render } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";
import NavLinkInTestContext from "./NavLinkInTestContext.svelte";
import userEvent from "@testing-library/user-event/dist/cjs/index.js";

const mockRouter = {
  navigate: vi.fn(),
  path: "/the-current-route"
};

const renderNavLink = (route = "/test-route"): void => {
  render(NavLinkInTestContext, {
    props: {
      router: mockRouter,
      route,
      text: "About",
      key: "about"
    }
  });
};

const getLinkElement = (): HTMLElement => screen.getByTestId("nav-about");

describe("NavLink", () => {
  test("displays text", async () => {
    renderNavLink();
    expect(getLinkElement()).toHaveTextContent("About");
  });

  test("navigates to route on click", async () => {
    renderNavLink();
    const user = userEvent.setup();
    await user.click(getLinkElement());
    expect(mockRouter.navigate).toHaveBeenCalledWith("/test-route");
  });

  test("applies current-nav-route class for current route", async () => {
    renderNavLink("/the-current-route");
    const link = getLinkElement();
    expect(link.classList).toContain("current-nav-route");
  });

  test("does not apply current-nav-route class for non-current route", async () => {
    renderNavLink();
    const link = getLinkElement();
    expect(link.classList).not.toContain("current-nav-route");
  });
});
