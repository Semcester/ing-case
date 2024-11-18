import { Router } from "@vaadin/router";

const outlet = document.getElementById("outlet");
const router = new Router(outlet);

router.setRoutes([
  {
    path: "/",
    component: "employee-list-view",
    action: async () => {
      await import("./views/employee-list-view.js");
    },
  },
  {
    path: "/create",
    component: "employee-create-view",
    action: async () => {
      await import("./views/employee-create-view.js");
    },
  },
  {
    path: "/edit/:id",
    component: "employee-edit-view",
    action: async () => {
      await import("./views/employee-edit-view.js");
    },
  },
  {
    path: "(.*)",
    action: () => {
      Router.go("/");
    },
  },
]);
