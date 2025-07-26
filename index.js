import {store} from './src/store/index.js';
import { setEmployees } from './src/store/employeeStore.js';
import { mockEmployees } from './src/contants/data.js';
import './src/router/index.js';
import './src/components/NavigationMenu.js';

const cachedEmployees = localStorage.getItem('employees');

if (cachedEmployees) {
  store.dispatch(setEmployees(JSON.parse(cachedEmployees)));
} else {
  store.dispatch(setEmployees(mockEmployees));
  localStorage.setItem('employees', JSON.stringify(mockEmployees));
}
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('employees', JSON.stringify(state.employee.employees));
});