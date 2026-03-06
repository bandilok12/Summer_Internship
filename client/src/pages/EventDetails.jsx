import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Card, ListGroup, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
        setLoading(false);
        
        // Check registration status
        if (user && res.data.attendees.some(a => a && a._id === user.id)) {
          setIsRegistered(true);
        }
      } catch (err) {
        setError('Event not found. It may have been removed or the URL is incorrect.');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/events/${id}/register`, {}, {
        headers: { 
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      // Update both event data and registration status
      setEvent(res.data);
      setIsRegistered(true);
    } catch (err) {
      setError('Failed to register for this event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  };

  if (loading && !event) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading event details...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
        <i className="bi bi-arrow-left me-1"></i> Back to Events
      </Button>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {event ? (
        <div className="mb-5">
          <div className="d-flex align-items-center mb-3">
            <Badge bg="primary" className="me-2">{event.category}</Badge>
            <small className="text-muted">
              Organized by <span className="fw-semibold">
                {event.organizer ? event.organizer.username : 'Deleted User'}
              </span>
            </small>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-8">
              <Card className="border-0 shadow-sm">
                <div 
                  className="bg-secondary rounded-top" 
                  style={{ 
                    height: '300px',
                    backgroundImage: `url('https://source.unsplash.com/random/1200x600/?event,${event.category}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <Card.Body>
                  <h1 className="display-5 fw-bold mb-3">{event.title}</h1>
                  <div className="d-flex align-items-center text-muted mb-4">
                    <i className="bi bi-calendar-event me-2"></i>
                    <span>{formatDate(event.date)}</span>
                    <i className="bi bi-geo-alt me-2 ms-3"></i>
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="h5 mb-3">About this event</h3>
                    <p className="lead">{event.description}</p>
                  </div>
                  
                  <div className="d-flex justify-content-start mt-5">
                    {user && event.organizer && user.id === event.organizer._id ? (
                      <Button variant="primary" size="lg" onClick={() => navigate(`/edit-event/${event._id}`)}>
                        <i className="bi bi-pencil me-2"></i> Edit Event
                      </Button>
                    ) : (
                      !isRegistered ? (
                        <Button 
                          variant="success" 
                          size="lg" 
                          onClick={handleRegister}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" animation="border" className="me-2" />
                              Registering...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-ticket-perforated me-2"></i> 
                              Register Now
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button variant="success" size="lg" disabled>
                          <i className="bi bi-check-circle me-2"></i> Already Registered
                        </Button>
                      )
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
            
            <div className="col-lg-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="py-3 bg-primary text-white">
                  <h2 className="h5 mb-0">Attendees</h2>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    <ListGroup.Item className="py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">Total Attendees</span>
                        <Badge bg="primary" pill>{event.attendees.length}</Badge>
                      </div>
                    </ListGroup.Item>
                    
                    {event.attendees.length > 0 ? (
                      event.attendees.map(attendee => (
                        <ListGroup.Item key={attendee._id} className="d-flex align-items-center py-2">
                          <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '36px', height: '36px'}}>
                            {attendee.username.charAt(0).toUpperCase()}
                          </div>
                          <span>{attendee.username}</span>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item className="text-center py-4 text-muted">
                        <i className="bi bi-people display-5 mb-3"></i>
                        <p>No attendees yet</p>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-calendar-x display-1 text-muted"></i>
          <h3>Event Not Found</h3>
          <p className="text-muted">The event you're looking for doesn't exist</p>
          <Button variant="primary" onClick={() => navigate('/')} className="mt-3">
            Browse Events
          </Button>
        </div>
      )}
    </Container>
  );
};

export default EventDetails;