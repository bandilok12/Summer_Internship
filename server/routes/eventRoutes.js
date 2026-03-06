const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create event
// server/routes/eventRoutes.js
router.post('/', auth, async (req, res) => {
  try {
    // Convert date string to Date object
    const eventData = {
      ...req.body,
      date: new Date(req.body.date),
      organizer: req.user.id
    };
    
    const event = new Event(eventData);
    await event.save();
    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'username');
    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// server/routes/eventRoutes.js
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username')
      .populate('attendees', 'username');
    
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all events
router.get('/', async (req, res) => {
  try {
    const { category, date, search } = req.query;
    const query = {};

    // Always show upcoming events
    query.date = { $gte: new Date() };

    // Apply category filter
    if (category) {
      query.category = category;
    }

    // Apply date filter
    if (date) {
      const filterDate = new Date(date);
      const nextDay = new Date(filterDate);
      nextDay.setDate(filterDate.getDate() + 1);
      
      query.date = {
        $gte: filterDate,
        $lt: nextDay
      };
    }

    // Apply text search
     // Apply text search
    if (search) {
      query.title = { 
        $regex: search, 
        $options: 'i'  // Case-insensitive
      };
    }

    const events = await Event.find(query)
      .sort({ date: 1 }) // Sort by date ascending
      .populate('organizer', 'username')
      .populate('attendees', 'username');

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Register for event
// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    
    // Check registration using ObjectId comparison
    if (event.attendees.some(attendee => attendee.equals(req.user.id))) {
      return res.status(400).json({ msg: 'Already registered' });
    }
    
    event.attendees.push(req.user.id);
    await event.save();
    
    // Populate all necessary fields
    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'username')
      .populate('attendees', 'username');
    
    res.json(populatedEvent); // Return full event object
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;