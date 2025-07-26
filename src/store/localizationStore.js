import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLang: 'en'
};

const localizationSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.currentLang = action.payload;
    }
  }
});

export const { setLanguage } = localizationSlice.actions;

export default localizationSlice.reducer;
