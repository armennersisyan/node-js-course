import API from '../../utils/api'
import { NotificationManager } from 'react-notifications';
import jwt_decode from 'jwt-decode';

export function loginUserSuccess(payload) {
  return {
    type: 'LOGIN',
    payload,
  };
}

export function signUserPending(status) {
  return {
    type: 'PENDING',
    status,
  };
}

export function logoutUserSuccess(payload) {
  localStorage.removeItem('user');
  return {
    type: 'LOGOUT',
    payload,
  };
}

export function registerUserRequest(payload) {
  return async function action(dispatch) {
    dispatch(signUserPending(true));
    let response;
    try {
      response = await API.post('signup', {
        ...payload,
      });
      NotificationManager.success('You have registered successfully!', 'Congratulations!');
    } catch (error) {
      NotificationManager.error('Please check your details', 'Oops!');
    } finally {
      dispatch(signUserPending(false));
    }
    return response;
  }
}

export function loginUserRequest(payload) {
  return async function action(dispatch) {
    dispatch(signUserPending(true));
    let response;
    try {
      response = await API.post('signin', {
        ...payload,
      });
      localStorage.setItem('auth-token', response.data.token);
      dispatch(loginUserSuccess(response.data));
    } catch (error) {
      NotificationManager.error('Invalid email or password!', 'Oops!');
    } finally {
      dispatch(signUserPending(false));
    }
    return response;
  }
}

export function setUser(token) {
  return async function action(dispatch) {
    dispatch(loginUserSuccess(jwt_decode(token)));
  }
}
