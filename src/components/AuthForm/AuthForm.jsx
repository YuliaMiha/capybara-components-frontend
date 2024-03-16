import { useForm } from 'react-hook-form';
import {
  LabelStyled,
  SignButton,
  WrapForm,
  WrapInput,
} from './AuthForm.styled';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PasswordInput from '../PasswordInput';
import TextInput from '../TextInput';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { Notify } from 'notiflix';
import { loginThunk, registerThunk } from '../../redux/User/UserThunks';
import { selectUser } from '../../redux/User/selectors';
import { useMediaQuery } from 'react-responsive';

const AuthForm = ({ signUp }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1439px)' });

  const schema = yup
    .object()
    .shape({
      email: yup
        .string()
        .email('Please write valid email')
        .required('Email is required'),
      password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(64)
        .required('Password is required'),

      repeat_password: signUp
        ? yup
            .string()
            .oneOf(
              [yup.ref('password'), null],
              "Passwords don't match, please try again."
            )
            .min(6, 'Password must be at least 8 characters')
            .required('Confirm password is required')
        : yup.string(),
    })
    .required();

  const submit = ({ email, password }) => {
    const user = { email, password };
    if (signUp) {
      dispatch(registerThunk(user))
        .unwrap()
        .then(() => {
          navigate('/signin');
          Notify.success('You can sign in now!');
        })
        .catch((err) => {
          Notify.warning(err);
        });
    } else {
      dispatch(loginThunk(user))
        .unwrap()
        .then(() => {
          navigate('/home');
          Notify.success('Welcome!');
        })
        .catch((err) => {
          Notify.warning(err);
        });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  return (
    <WrapForm>
      <form onSubmit={handleSubmit(submit)}>
        <WrapInput>
          <LabelStyled>Enter your email</LabelStyled>
          <TextInput
            register={register}
            error={errors.email}
            id="email"
            width={isDesktop ? 384 : isTablet ? 336 : 280}
            type="email"
            placeholder="E-mail"
          />
        </WrapInput>

        <WrapInput>
          <LabelStyled>Enter your password</LabelStyled>
          <PasswordInput
            error={errors.password}
            register={register}
            id="password"
            width={isDesktop ? 384 : isTablet ? 336 : 280}
            type="password"
            placeholder="Password"
          />
        </WrapInput>

        {signUp && (
          <WrapInput>
            <LabelStyled>Repeat password</LabelStyled>
            <PasswordInput
              error={errors.repeat_password}
              register={register}
              id="repeat_password"
              width={isDesktop ? 384 : isTablet ? 336 : 280}
              type="repeat_password"
              placeholder="Password"
            />
          </WrapInput>
        )}

        <SignButton type="submit">{signUp ? 'Sign Up' : 'Sign In'}</SignButton>
      </form>
    </WrapForm>
  );
};

export default AuthForm;
