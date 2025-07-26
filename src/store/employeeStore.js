import { createSlice } from '@reduxjs/toolkit';

const employeesSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
    selectedEmployee: null,
  },
  reducers: {
    setEmployees(state, action) {
      state.employees = action.payload;
    },
    deleteEmployee(state, action) {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
    selectEmployee(state, action) {
      state.selectedEmployee = action.payload;
    },
    addEmployee(state, action) {
      state.employees.unshift(action.payload);
    },
    updateEmployee(state, action) {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
  },
});

export const {
  setEmployees,
  deleteEmployee,
  selectEmployee,
  addEmployee,
  updateEmployee,
} = employeesSlice.actions;

export default employeesSlice.reducer;
