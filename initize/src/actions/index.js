/* 
  Action Types Go Here!
  Be sure to export each action type so you can pull it into your reducer
*/
export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN"

export const handleLogin = (payload) => dispatch => {
  dispatch({type: LOGIN, payload:payload})
}
