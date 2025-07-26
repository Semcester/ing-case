import { Router } from "@vaadin/router";

window.addEventListener('DOMContentLoaded', () => {
  const outlet = document.getElementById("outlet");
  const router = new Router(outlet);

  router.setRoutes([
    {
      path: "/",
      component: "employee-list-page",
      action: async () => {
        await import("../../src/pages/EmployeeListPage.js");
      },
    },
    {
      path: "/employee/new",
      component: "employee-form-page",
      action: async () => {
        await import("../../src/pages/EmployeeFormPage.js");
      },
    },
    {
      path: "/employees/edit/:id",
      component: "employee-form-page",
      action: async () => {
        await import("../../src/pages/EmployeeFormPage.js");
      },
    },
    {
      path: "(.*)",
      action: () => {
        Router.go("/");
      },
    },
  ]);
});
