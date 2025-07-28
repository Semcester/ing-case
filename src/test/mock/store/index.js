export const store = {
  getState: () => ({
    employee: { employees: [], selectedEmployee: null },
    localization: { currentLang: 'en' }
  }),
  subscribe: () => () => {},
  dispatch: () => {}
};