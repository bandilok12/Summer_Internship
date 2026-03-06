import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Container } from 'react-bootstrap';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While the authentication status is being checked, show a loader.
  // This prevents a brief flash of the login page for already logged-in users.
  if (loading) {
    return (
      <Container className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  // If the check is complete and there's a user, render the requested page.
  // Otherwise, redirect them to the login page.
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;