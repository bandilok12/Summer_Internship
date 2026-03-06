import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear validation error when user types
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const { username, email, password, confirmPassword } = formData;
    
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Remove confirmPassword from the data sent to server
      const { confirmPassword, ...userData } = formData;
      
      const response = await axios.post('/api/users', userData);
      
      // If successful, show success message and redirect
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
          
          // Handle specific backend validation errors
          if (err.response.status === 409) {
            if (errorMessage.includes('email')) {
              setValidationErrors({ email: errorMessage });
            } else if (errorMessage.includes('Username')) {
              setValidationErrors({ username: errorMessage });
            }
          }
        } else if (err.response.status === 400) {
          errorMessage = 'Invalid data provided';
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = 'Request setup error: ' + err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="py-5 text-center">
        <div className="mb-4">
          <i className="bi bi-check-circle-fill text-success display-1"></i>
        </div>
        <h2 className="mb-3">Registration Successful!</h2>
        <p className="lead">You will be redirected to login shortly...</p>
        <Spinner animation="border" variant="success" className="mt-3" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Create an Account</h1>
        <p className="lead text-muted">Join us to create and manage events</p>
      </div>
      
      <div className="d-flex justify-content-center">
        <Card className="glass-container border-0 shadow-sm" style={{ width: '100%', maxWidth: '450px' }}>
          <Card.Body className="p-4">
            {error && !Object.keys(validationErrors).length && (
              <Alert variant="danger" className="mb-4">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username (min 3 chars)"
                  isInvalid={!!validationErrors.username}
                  className="py-2"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.username}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  isInvalid={!!validationErrors.email}
                  className="py-2"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 characters)"
                  isInvalid={!!validationErrors.password}
                  className="py-2"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.password}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  isInvalid={!!validationErrors.confirmPassword}
                  className="py-2"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
              
              <div className="d-grid mb-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  type="submit" 
                  disabled={loading}
                  className="py-3"
                >
                  {loading ? (
                    <>
                      <Spinner 
                        as="span" 
                        animation="border" 
                        size="sm" 
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
              
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-0">Already have an account?</p>
                <Link to="/login" className="btn btn-outline-primary mt-2">
                  Sign in instead
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Register;