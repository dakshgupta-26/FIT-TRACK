import React from 'react';
import { AuthContainer } from '@/components/auth/AuthContainer';

const Signup: React.FC = () => {
  return <AuthContainer initialMode="signup" />;
};

export default Signup;