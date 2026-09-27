import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Single AppShell Architecture
 * Avoids nested/duplicate navigation shells. Redirects to authenticated /dashboard.
 */
const Index: React.FC = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Index;
