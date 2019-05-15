// Importing actions here
import
{
    LOGIN,
    SIGNUP,
    ADDBOARD,
    ADDBOARDID,
}from '../actions/index';

const initialState = {
    loggedIn: false,
    email:"",
    name:"",
    phoneNumber:"",
    uid:"",
    profilePicture:"",
    dateJoined: "",
    boardsId:[],
    boards:[]
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
                uid: action.payload.uid,
                name: action.payload.name,
                dateJoined: action.payload.dateJoined,
                profilePicture: action.payload.profileImg,
                boards:action.payload.boards,
                boardsId: action.payload.boards
            };
            
        case ADDBOARD:
            return{...state, boards: action.payload};
        case ADDBOARDID:
            return{...state, boardsId: state.boardsId.push(action.payload)}
        default:
            return state;
    }
}