import { fixture, expect } from "@open-wc/testing";
import "../src/views/employee-create-view.js";

describe("EmployeeCreateView", () => {
  it("renders correctly", async () => {
    const el = await fixture("<employee-create-view></employee-create-view>");
    expect(el.shadowRoot.querySelector("employee-form-view")).to.exist;
  });

  it('dispatches "employee-created" event and shows success toast', async () => {
    const el = await fixture("<employee-create-view></employee-create-view>");
    const employeeForm = el.shadowRoot.querySelector("employee-form-view");
    const toast = document.createElement("div");
    toast.id = "toast";
    toast.show = sinon.spy();
    document.body.appendChild(toast);

    const newEmployee = { id: 1, name: "John Doe" };
    employeeForm.dispatchEvent(
      new CustomEvent("employee-created", { detail: newEmployee }),
    );

    expect(toast.show.calledOnce).to.be.true;
    expect(toast.show.calledWith("Employee added successfully", "success")).to
      .be.true;

    document.body.removeChild(toast);
  });
});
