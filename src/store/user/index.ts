import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IState {
  isLoading: boolean;
  user: UserData;
}

interface UserData {
  isAuthenticated: boolean;
  email: string;
  name: string;
  photo: string;
  emailIsConfirmed: boolean;
}

const initialState: IState = {
  isLoading: false,
  user: {
    isAuthenticated: false,
    email: '',
    name: '',
    photo: '',
    emailIsConfirmed: false,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setUserData(state, action: PayloadAction<UserData>) {
      state.user = { ...state.user, ...action.payload };
    },

    reset(state) {
      state.user = {
        name: '',
        email: '',
        photo: '',
        isAuthenticated: false,
        emailIsConfirmed: false,
      };
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;