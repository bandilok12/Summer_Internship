import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-bootstrap';

const Layout = ({ children }) => {
  const { error } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {/* Global error display */}
      {error && (
        <Alert variant="danger" className="m-0 rounded-0 text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}
      
      <main className="flex-grow-1 py-4">
        <div className="container glass-container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;