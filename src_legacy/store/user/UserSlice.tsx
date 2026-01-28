import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  //token: string|undefined
  loadInit: boolean;
  userId: string | undefined;
  userEmail: string | undefined;
  userMobile: string | undefined;
  userLevel: string | undefined;
}

const initialState: UserState = {
  //token: undefined,
  loadInit: false,
  userId: undefined,
  userEmail: undefined,
  userMobile: undefined,
  userLevel: undefined,
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadInit: (state: UserState, action: PayloadAction<boolean>) => {
      state.loadInit = action.payload;
    },
    userId: (state: UserState, action: PayloadAction<string | undefined>) => {
      state.userId = action.payload;
    },
    userEmail: (state: UserState, action: PayloadAction<string | undefined>) => {
      state.userEmail = action.payload;
    },
    userMobile: (state: UserState, action: PayloadAction<string | undefined>) => {
      state.userMobile = action.payload;
    },
    userLevel: (state: UserState, action: PayloadAction<string | undefined>) => {
      state.userLevel = action.payload;
    },
  },
});

export const { loadInit, userId, userEmail, userMobile, userLevel } = UserSlice.actions;

export default UserSlice.reducer;
