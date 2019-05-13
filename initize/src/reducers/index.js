// Importing actions here
import
{
    LOGIN,
    SIGNUP
}from '../actions/index';

const initialState = {
    loggedIn: false,
    email:"",
    name:"",
    phoneNumber:"",
    uid:"",
    profilePicture:"",
}

export const reducer = (state = initialState, action) => {

    switch(action.type){
        case SIGNUP:
            const {email, phoneNumber, name, uid} = action.payload;
            return {
                ...state,
                loggedIn:true, 
                email : email, 
                name: name, 
                phoneNumber: phoneNumber, 
                uid:uid
            }

        case LOGIN:
            // const {email, phoneNumber, uid} = action.payload;
            return{
                ...state, 
                loggedIn:true, 
                email: action.payload.email, 
                phoneNumber: action.payload.phoneNumber, 
                uid: action.payload.uid
            };
            
        default:
            return state;
    }
}