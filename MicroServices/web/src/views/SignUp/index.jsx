import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { Container } from 'react-bootstrap';
import { registerUserRequest } from '../../store/actions'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Error from '../../components/UI/Error';
import styles from './styles.module.scss';

import logo from '../../assets/img/logo.png';

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('First Name field is required'),
  lastName: yup
    .string()
    .required('Last Name field is required'),
  username: yup
    .string()
    .required('Username field is required'),
  password: yup
    .string()
    .required('Password field is required')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
});

function SignUp() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  });

  const isPending = useSelector((state) => state.auth && state.auth.isPending);

  function onSubmit(data) {
    dispatch(registerUserRequest(data)).then((res) => {
      if (!res) return;
      history.push('/sign-in')
    })
  }

  return (
    <div className={styles.signUp}>
      <Container>
        <div className={styles.card}>
          <div className={styles['card__logo']}>
            <img src={logo} alt="logo" />
            <span>Chat App</span>
          </div>
          <h1>Create a new Account</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="firstName" className="txt-label">First Name</label>
            <input
              id="firstName"
              name="firstName"
              className={`txt-field ${errors.firstName?.message ? 'has-error' : null}`}
              placeholder="First Name"
              ref={register}
            />
            <Error show={errors.firstName?.message}>{ errors.firstName?.message }</Error>

            <label htmlFor="lastName" className="txt-label">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              className={`txt-field ${errors.lastName?.message ? 'has-error' : null}`}
              placeholder="Last Name"
              ref={register}
            />
            <Error show={errors.lastName?.message}>{ errors.lastName?.message }</Error>

            <label htmlFor="username" className="txt-label">Username</label>
            <input
              id="username"
              name="username"
              className={`txt-field ${errors.username?.message ? 'has-error' : null}`}
              placeholder="Username"
              ref={register}
            />
            <Error show={errors.username?.message}>{ errors.username?.message }</Error>

            <label htmlFor="password" className="txt-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`txt-field ${errors.password?.message ? 'has-error' : null}`}
              placeholder="Password"
              ref={register}
            />
            <Error show={errors.password?.message}>{ errors.password?.message }</Error>

            <input
              className={styles['btn-submit']}
              value="Sign Up"
              type="submit"
              disabled={isPending}
            />
          </form>
          <p className={styles.txt}>Already have an account? <Link to="/sign-in">Sign In</Link></p>
        </div>
      </Container>
    </div>
  );
}

export default SignUp;
