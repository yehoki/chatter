import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


export enum RoomChoiceOption {
  CREATE,
  JOIN,
  NONE,
}

export interface PageChoiceState {
  pageChoice: RoomChoiceOption;
}

const initialState: PageChoiceState = {
  pageChoice: RoomChoiceOption.NONE,
};

export const pageChoiceSlice = createSlice({
  name: 'pageChoice',
  initialState,
  reducers: {
    setPageChoice: (state, action: PayloadAction<RoomChoiceOption>) => {
      state.pageChoice = action.payload;
    },
  },
});

export const { setPageChoice } = pageChoiceSlice.actions;

export default pageChoiceSlice.reducer;
