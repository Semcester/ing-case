import { configureStore, createSlice } from "@reduxjs/toolkit";

const employeesSlice = createSlice({
    name: "employees",
    initialState: {
        employees: [],
        selectedEmployee: null,
    },
    reducers: {
        setEmployees(state, action) {
            state.employees = action.payload;
        },
        deleteEmployee(state, action) {
            state.employees = state.employees.filter(
                (emp) => emp.id !== action.payload
            );
        },
        selectEmployee(state, action) {
            state.selectedEmployee = action.payload;
        },
        addEmployee(state, action) {
            state.employees = [action.payload, ...state.employees];
        },
        updateEmployee(state, action) {
            const index = state.employees.findIndex(
                (emp) => emp.id === action.payload.id
            );
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

const store = configureStore({
    reducer: {
        employees: employeesSlice.reducer,
    },
});

export default store;
