/* 
  Action Types Go Here!
  Be sure to export each action type so you can pull it into your reducer
*/
export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const ADDBOARD = "ADD_BOARD";
export const ADDBOARDID = "ADDBOARDID"

export const handleLogin = (payload) => dispatch => {
  dispatch({type: LOGIN, payload:payload})
}

export const handleSignup = (payload) => dispatch => {
  dispatch({type: SIGNUP, payload:payload})
} 

export const addBoard = payload => dispatch => {
  dispatch({type:ADDBOARD, payload:payload})
}

export const addBoardId = payload => dispatch => {
  dispatch({type: ADDBOARDID, payload: payload})
}
