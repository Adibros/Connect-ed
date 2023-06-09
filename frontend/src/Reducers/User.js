import { createReducer } from "@reduxjs/toolkit";


const initialState = {};

export const userReducer = createReducer(initialState,{
    loginRequest: (state,action) => {},
    loginSuccess: (state,action) => {},
    loginFailure : (state,action) => {},

    RegisterRequest: (state,action) => {},
    RegisterSuccess : (state,action) => {},
    RegisterFailure : (state,action) => {},

    LoadUserRequest : (state,action) => {},
    LoadUserSuccess : (state,action) => {},
    LoadUserFailure : (state,action) => {},

});