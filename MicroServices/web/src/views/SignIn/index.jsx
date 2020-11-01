import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers';
import { Container } from 'react-bootstrap';
import * as yup from 'yup';

import { loginUserRequest } from '../../store/actions'

import Error from '../../components/UI/Error';
import logo from '../../assets/img/logo.png';
import styles from './styles.module.scss';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username field is required'),
  password: yup
    .string()
    .required('Password field is required')
});

function SignUp() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  });

  const isPending = useSelector((state) => state.auth && state.auth.isPending);

  function onSubmit(data) {
    dispatch(loginUserRequest(data)).then((res) => {
      if (!res) return;
      history.push('/home')
    });
  }

  return (
    <div className={styles.signIn}>
      <Container>
        <div className={styles.card}>
          <div className={styles['card__logo']}>
            <img src={logo} alt="logo" />
            <span>Chat App</span>
          </div>
          <h1>Sign In to your account</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="txt-label">Email</label>
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
              className={`txt-field ${errors.password?.message ? 'has-error' : null}`}
              placeholder="Password"
              type="password"
              ref={register}
            />
            <Error show={errors.password?.message}>{ errors.password?.message }</Error>

            <input
              className={styles['btn-submit']}
              value="Sign In"
              type="submit"
              disabled={isPending}
            />
          </form>
          <p className={styles.txt}>Don't have an account yet? <Link to="/sign-up">Sign Up</Link></p>
        </div>
    </Container>
    </div>
  );
}

export default SignUp;
