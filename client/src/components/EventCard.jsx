import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Card className="h-100 shadow-sm border-0 overflow-hidden">
      <div className="position-relative">
        <div 
          className="bg-secondary" 
          style={{ 
            height: '160px',
            backgroundImage: `url('https://source.unsplash.com/random/600x400/?event,${event.category}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-primary">{event.category}</span>
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-2">{event.title}</Card.Title>
        <div className="d-flex align-items-center text-muted mb-2">
          <i className="bi bi-calendar me-2"></i>
          <small>{formatDate(event.date)}</small>
        </div>
        <div className="d-flex align-items-center text-muted mb-3">
          <i className="bi bi-geo-alt me-2"></i>
          <small>{event.location}</small>
        </div>
        <Card.Text className="flex-grow-1 text-truncate">
          {event.description}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-people me-1"></i>
            <span>{event.attendees.length} attending</span>
          </div>
          <Link to={`/events/${event._id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventCard;