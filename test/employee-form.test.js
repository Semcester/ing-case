import { fixture, expect } from "@open-wc/testing";
import sinon from "sinon";

import "../src/components/employee-form.js";

describe("EmployeeFormView", () => {
  it("renders the form correctly", async () => {
    const el = await fixture("<employee-form-view></employee-form-view>");
    const form = el.shadowRoot.querySelector("form");
    expect(form).to.exist;
  });

  it('dispatches "employee-created" event on form submission', async () => {
    const el = await fixture(
      '<employee-form-view mode="create"></employee-form-view>',
    );
    const form = el.shadowRoot.querySelector("form");
    const spy = sinon.spy();
    el.addEventListener("employee-created", spy);

    form.dispatchEvent(new Event("submit"));
    expect(spy.called).to.be.true;
  });
});
