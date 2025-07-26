import {store} from './src/store/index.js';
import { setEmployees } from './src/store/employeeStore.js';
import { mockEmployees } from './src/contants/data.js';
import './src/router/index.js';
import './src/components/NavigationMenu.js';

store.dispatch(setEmployees(mockEmployees));
