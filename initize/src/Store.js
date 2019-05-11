import React from 'react'

export const Store = React.createContext(); //creates context object

const initialState = {
    loggedIn: false,
    email:"",
    name:"",
    phoneNumber:"",
    uid:"",
}

function reducer(state, action) {
    switch(action.type){
        case 'SIGNUP':
            const {email, phoneNumber, name, uid} = action.payload;
            return {...state,loggedIn:true, email : email, name: name, phoneNumber: phoneNumber, uid:uid}
        case 'LOGIN':
            // const {email, phoneNumber, uid} = action.payload;
            return{...state, loggedIn:true, email: action.payload.email, phoneNumber: action.payload.phoneNumber, uid: action.payload.uid};
        default:
            return state;
    }
}

export default function StoreProvider(props) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const value = { state, dispatch }; //creates an object from above statement that holds both the values
    return <Store.Provider value={value}>{props.children}</Store.Provider>
} 
// This will be the react component that will encapsulate the other components in the application. 
// It has an argument of props because that’s how we’ll get access to the other child components.
// This will be given to index.js to hold state