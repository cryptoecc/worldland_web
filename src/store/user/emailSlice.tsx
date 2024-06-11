import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EmailState {
  searchedEmail: string | undefined;
}

const initialState: EmailState = {
  searchedEmail: undefined,
};

export const EmailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    searchedEmail: (state: EmailState, action: PayloadAction<string | undefined>) => {
      state.searchedEmail = action.payload;
    },
  },
});

export const { searchedEmail } = EmailSlice.actions;

export default EmailSlice.reducer;
