import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeStore';
import localizationReducer from './localizationStore';

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    localization: localizationReducer,
  },
});
