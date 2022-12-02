import {createSlice} from '@reduxjs/toolkit'


const authSlice = createSlice({
    name: 'auth',
    initialState:{
        isLoggedin: false,
        token: localStorage.getItem('token')||'',
        user: null, 
        isAdmin: false,
        isAuthenticating: false,
    },
    reducers: {
        setToken(state, action){
            state.token = action.payload
            localStorage.setItem('token', state.token)
        }, 
        deleteToken(state){
            state.token = ''
            localStorage.removeItem('token')
            state.isLoggedin= false
            state.user= null
            state.isAdmin= false
        },
        setUser(state,action){
            state.user = action.payload
            state.isLoggedin = true
        },
        setAuthenticating(state,action){
            state.isAuthenticating = action.payload
        },
        setAdmin(state,action){
            state.isAdmin = action.payload
        }
    }
})

export const {setToken, setAuthenticating, setUser,deleteToken, setAdmin} = authSlice.actions
export default authSlice.reducer