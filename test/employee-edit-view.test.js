import { fixture, expect } from "@open-wc/testing";
import sinon from "sinon";
import "../src/views/employee-edit-view.js";

describe("EmployeeEditView", () => {
  it("renders the edit form with employee data", async () => {
    const el = await fixture("<employee-edit-view></employee-edit-view>");
    el.employee = { id: 1, firstName: "John", lastName: "Doe" };
    await el.updateComplete;

    const form = el.shadowRoot.querySelector("employee-form-view");
    expect(form).to.exist;
    expect(form.mode).to.equal("edit");
    expect(form.employee.firstName).to.equal("John");
  });

  it('dispatches "employee-updated" event and shows success toast', async () => {
    const el = await fixture("<employee-edit-view></employee-edit-view>");
    el.employee = { id: 1, firstName: "John", lastName: "Doe" };

    const toast = document.createElement("div");
    toast.id = "toast";
    toast.show = sinon.spy();
    document.body.appendChild(toast);

    const form = el.shadowRoot.querySelector("employee-form-view");
    form.dispatchEvent(
      new CustomEvent("employee-updated", {
        detail: { id: 1, firstName: "John Updated" },
      }),
    );

    expect(toast.show.calledOnce).to.be.true;
    expect(toast.show.calledWith("Employee updated successfully", "success")).to
      .be.true;

    document.body.removeChild(toast);
  });
});
