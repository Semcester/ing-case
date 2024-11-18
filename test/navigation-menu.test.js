import { fixture, expect } from "@open-wc/testing";
import "../src/components/navigation-menu.js";

describe("NavigationMenu", () => {
  it("renders the navigation menu", async () => {
    const el = await fixture("<navigation-menu></navigation-menu>");
    const nav = el.shadowRoot.querySelector("nav");
    expect(nav).to.exist;
  });

  it("changes language when flag is clicked", async () => {
    const el = await fixture("<navigation-menu></navigation-menu>");
    const flag = el.shadowRoot.querySelector(
      '.language-dropdown img[alt="English"]',
    );
    flag.click();
    expect(el.currentLang).to.equal("en");
  });
});
