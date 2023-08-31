import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const Manage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    eventName: "",
    date: "",
    time: "",
    location: "",
    description: "",
    artist: "",
    ticketPrice: 0,
    email: '',
  });

  useEffect(() => {
    fetch("https://eventplaza.onrender.com/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const openModal = (event) => {
    setSelectedEvent(event);
    setEditedEvent({ ...event });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    // Implement your edit functionality here
    fetch(`https://eventplaza.onrender.com/api/events/${selectedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Event updated successfully:", data);
        // Fetch updated data after editing
        fetch("https://eventplaza.onrender.com/api/events")
          .then((response) => response.json())
          .then((data) => {
            setEvents(data);
            closeModal();
          })
          .catch((error) => console.error("Error fetching events:", error));
      })
      .catch((error) => console.error("Error updating event:", error));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = (eventId) => {
    fetch(`https://eventplaza.onrender.com/api/events/${eventId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Event deleted successfully:", data);
        // Fetch updated data after deletion
        fetch("https://eventplaza.onrender.com/api/events")
          .then((response) => response.json())
          .then((data) => {
            setEvents(data);
          })
          .catch((error) => console.error("Error fetching events:", error));
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Manage Events</h1>
      <div className="table-responsive">
        <table className="table">
          <thead >
            <tr>
              <th style={{backgroundColor:'red'}}>S.No</th>
              <th style={{backgroundColor:'red'}}>Event Name</th>
              <th style={{backgroundColor:'red'}}>Date</th>
              <th style={{backgroundColor:'red'}}>Time</th>
              <th style={{backgroundColor:'red'}}>Location</th>
              <th style={{backgroundColor:'red'}}>Description</th>
              <th style={{backgroundColor:'red'}}>Artist</th>
              <th style={{backgroundColor:'red'}}>Ticket Price</th>
              <th style={{backgroundColor:'red'}}>Edit</th>
              <th style={{backgroundColor:'red'}}>Delete</th>
              <th style={{backgroundColor:'red'}}>Email</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id}>
                <td>{index + 1}</td>
                <td>{event.eventName}</td>
                <td>{event.date}</td>
                <td>{event.time}</td>
                <td>{event.location}</td>
                <td>{event.description}</td>
                <td>{event.artist}</td>
                <td>{event.ticketPrice}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openModal(event)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <a
                    href={`mailto:${event.email}?subject=${encodeURIComponent(
                      event.eventName
                    )}&body=${encodeURIComponent(
                      `Event: ${event.eventName}\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\nDescription: ${event.description}\nArtist: ${event.artist}\nTicket Price: ${event.ticketPrice}`
                    )}`}
                    className="btn btn-success btn-sm"
                  >
                    Email
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Event Modal"
        style={{
          overlay: { zIndex: 999 },
          content: { width: "90%", maxWidth: "600px", margin: "0 auto" },
        }}
      >
        {selectedEvent && (
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                <u>Edit Event</u>
              </h2>
              <button
                type="button"
                className="close"
                onClick={closeModal}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="eventName">Event Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventName"
                  name="eventName"
                  value={editedEvent.eventName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={editedEvent.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time:</label>
                <input
                  type="time"
                  className="form-control"
                  id="time"
                  name="time"
                  value={editedEvent.time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={editedEvent.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  value={editedEvent.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="artist">Artist:</label>
                <input
                  type="text"
                  className="form-control"
                  id="artist"
                  name="artist"
                  value={editedEvent.artist}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ticketPrice">Ticket Price:</label>
                <input
                  type="number"
                  className="form-control"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={editedEvent.ticketPrice}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEdit}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Manage;
