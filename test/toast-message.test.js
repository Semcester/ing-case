import { fixture, expect } from "@open-wc/testing";
import "../src/components/toast-message.js";

describe("ToastMessage", () => {
  it("renders correctly", async () => {
    const el = await fixture("<toast-message></toast-message>");
    expect(el.shadowRoot).not.to.be.null;
    expect(el.shadowRoot.querySelector("span")).to.exist;
  });

  it("shows a message when show is called", async () => {
    const el = await fixture("<toast-message></toast-message>");
    el.show("Success", "success");
    await el.updateComplete;
    const span = el.shadowRoot.querySelector("span");
    expect(span.textContent).to.equal("Success");
  });

  it("hides the message when hide is called", async () => {
    const el = await fixture("<toast-message></toast-message>");
    el.show("Success", "success");
    el.hide();
    expect(el.classList.contains("show")).to.be.false;
    expect(el.classList.contains("hide")).to.be.true;
  });
});
