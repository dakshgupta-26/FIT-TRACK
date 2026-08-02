import React from 'react';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { OtpVerificationCard } from '@/components/auth/OtpVerificationCard';

const SignupVerify: React.FC = () => {
  return (
    <AuthContainer>
      <OtpVerificationCard />
    </AuthContainer>
  );
};

export default SignupVerify;
