import React from 'react';
import { AuthContainer } from '@/components/auth/AuthContainer';

const Login: React.FC = () => {
  return <AuthContainer initialMode="login" />;
};

export default Login;