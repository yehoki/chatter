import { configureStore } from '@reduxjs/toolkit';
import pageChoiceReducer from '../features/pageChoiceSlice';

export const store = configureStore({
  reducer: {
    pageChoice: pageChoiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
