import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Conference'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate required fields
    if (!formData.title || !formData.date || !formData.location) {
      setError('Title, date, and location are required fields');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/events', formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      navigate(`/events/${res.data._id}`);
    } catch (error) {
      // Handle token expiration
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        logout();
      } else {
        setError(error.response?.data?.error || 'Error creating event. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Create a New Event</h1>
        <p className="lead text-muted">Fill in the details below to create your event</p>
      </div>
      
      <Card className="border-0 shadow-sm mx-auto glass-container" style={{ maxWidth: '800px' }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Event Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a catchy title for your event"
                required
                className="py-2"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event in detail..."
                className="py-2"
              />
            </Form.Group>
            
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Venue or online link"
                    required
                    className="py-2"
                  />
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-5">
              <Form.Label className="fw-semibold">Category</Form.Label>
              <Form.Select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="py-2"
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Social">Social</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-grid">
              <Button 
                variant="primary" 
                size="lg" 
                type="submit" 
                disabled={loading}
                className="py-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Event...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateEvent;