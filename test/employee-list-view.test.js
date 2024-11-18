import { fixture, expect } from "@open-wc/testing";
import sinon from "sinon";
import "../src/views/employee-list-view.js";

describe("EmployeeListView", () => {
  it("renders the employee list correctly", async () => {
    const el = await fixture("<employee-list-view></employee-list-view>");
    el.employees = [
      { id: 1, firstName: "John", lastName: "Doe" },
      { id: 2, firstName: "Jane", lastName: "Doe" },
    ];
    await el.updateComplete;

    const rows = el.shadowRoot.querySelectorAll("table tbody tr");
    expect(rows.length).to.equal(2);
    expect(rows[0].textContent).to.include("John");
    expect(rows[1].textContent).to.include("Jane");
  });

  it("deletes an employee and shows success toast", async () => {
    const el = await fixture("<employee-list-view></employee-list-view>");
    el.employees = [{ id: 1, firstName: "John", lastName: "Doe" }];
    await el.updateComplete;

    const toast = document.createElement("div");
    toast.id = "toast";
    toast.show = sinon.spy();
    document.body.appendChild(toast);

    el._confirmDelete({ id: 1 });
    expect(toast.show.calledOnce).to.be.true;
    expect(toast.show.calledWith("Employee deleted successfully", "success")).to
      .be.true;

    document.body.removeChild(toast);
  });
});
