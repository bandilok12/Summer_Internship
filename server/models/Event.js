const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // server/models/Event.js
date: { 
  type: Date, 
  required: true,
  validate: {
    validator: function(v) {
      return v > new Date(); 
    },
    message: 'Event date must be in the future'
  }
},
  location: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: { type: String, enum: ['Conference', 'Workshop', 'Social', 'Other'] },
  createdAt: { type: Date, default: Date.now }
});
eventSchema.index({ title: 'text', description: 'text',location: 'text'  });
eventSchema.virtual('attendeesCount').get(function() {
  return this.attendees.length;
});
module.exports = mongoose.model('Event', eventSchema);