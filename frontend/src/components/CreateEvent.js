import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [artist, setArtist] = useState('');
  const [ampm, setAMPM] = useState('AM');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateEvent = () => {
    if (
      eventName.trim() === '' ||
      date.trim() === '' ||
      time.trim() === '' ||
      location.trim() === '' ||
      description.trim() === '' ||
      ticketPrice.trim() === '' ||
      artist.trim() === ''
    ) {
      setErrorMessage('Please fill in all fields.');
      setSuccessMessage('');
      return;
    }

    const [hours, minutes] = time.split(':');
    const eventTime = ampm === 'AM' ? `${hours}:${minutes}` : `${Number(hours) + 12}:${minutes}`;

    const eventData = {
      eventName,
      date,
      time: eventTime,
      location,
      description,
      ticketPrice,
      artist,
    };

    fetch('https://eventplaza.onrender.com/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSuccessMessage('Event stored successfully');
          setErrorMessage('');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setErrorMessage('Error creating event');
          setSuccessMessage('');
        }
      })
      .catch(error => {
        console.error('Error creating event:', error);
        setErrorMessage('Error creating event');
        setSuccessMessage('');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Create Event</h1>
      <form>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Event Name</label>
              <input
                type="text"
                className="form-control"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <div className="input-group">
                <input
                  type="time"
                  className="form-control"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
                <select
                  className="form-control"
                  value={ampm}
                  onChange={e => setAMPM(e.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Artists</label>
              <input
                type="text"
                className="form-control"
                value={artist}
                onChange={e => setArtist(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Ticket Price</label>
              <input
                type="number"
                className="form-control"
                value={ticketPrice}
                onChange={e => setTicketPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleCreateEvent}>
          Create Event
        </button>
      </form>
      {successMessage && <p className="mt-3 text-success">{successMessage}</p>}
      {errorMessage && <p className="mt-3 text-danger">{errorMessage}</p>}
    </div>
  );
};

export default CreateEvent;
