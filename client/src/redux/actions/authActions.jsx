import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from './types'; // Register User
import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object

const BASEURL = process.env.NODE_ENV === 'production' ?'https://onlinecommunity.onrender.com' : 'http://localhost:5000';
const socket = io(BASEURL);
console.log(BASEURL,"connection url")

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

export const registerUser = (userData, history) => dispatch => {
  axios
    .post(BASEURL+'/api/users/register', userData)
    .then(res => history.push('/login')) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}; // Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post(BASEURL+'/api/users/login', userData)
    .then(res => {
      // Save to localStorage// Set token to localStorage
      const { token,name } = res.data;
      console.log(res.data.name,"token")
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('name', name);

      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}; // Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
}; // User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
}; // Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  let name=localStorage.getItem('name');

  socket.emit("logout",name)
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('name');

  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
