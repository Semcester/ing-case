import "./components/navigation-menu.js";
import "./components/toast-message.js";

import "./router.js";

import store from "./store/store.js";
import { setEmployees } from "./store/store.js";
import { employeesData } from "./data/constants.js";

import "./style.css";

store.dispatch(setEmployees(employeesData));
