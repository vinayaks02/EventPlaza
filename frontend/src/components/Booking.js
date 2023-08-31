import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedBooking, setEditedBooking] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  // const entriesPerPage = 5;

  useEffect(() => {
    fetch("https://eventplaza.onrender.com/api/bookings")
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
    setEditedBooking({ ...booking });
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedBooking((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    fetch(`https://eventplaza.onrender.com/api/bookings/${selectedBooking.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedBooking),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Booking updated successfully:", data);
        fetch("https://eventplaza.onrender.com/api/bookings")
          .then((response) => response.json())
          .then((data) => {
            setBookings(data);
            closeModal();
          })
          .catch((error) => console.error("Error fetching bookings:", error));
      })
      .catch((error) => console.error("Error updating booking:", error));
  };

  const handleDelete = (bookingId) => {
    fetch(`https://eventplaza.onrender.com/api/bookings/${bookingId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Booking deleted successfully:", data);
        fetch("https://eventplaza.onrender.com/api/bookings")
          .then((response) => response.json())
          .then((data) => {
            setBookings(data);
          })
          .catch((error) => console.error("Error fetching bookings:", error));
      })
      .catch((error) => console.error("Error deleting booking:", error));
  };

  const eventTotals = {};

  bookings.forEach((booking) => {
    if (!eventTotals[booking.eventName]) {
      eventTotals[booking.eventName] = {
        totalTicketCount: parseInt(booking.numTickets, 10),
        totalAmount: parseFloat(booking.totalAmount),
      };
    } else {
      eventTotals[booking.eventName].totalTicketCount += parseInt(
        booking.numTickets,
        10
      );
      eventTotals[booking.eventName].totalAmount += parseFloat(
        booking.totalAmount
      );
    }
  });

  return (
    <div className="container mt-5">
      <div className="mt-3">
        <h2 className="text-center">Event Totals</h2>
        <div className="table-responsive">
          <table className="table" >
            <thead>
              <tr>
                <th style={{backgroundColor:'red',}}>Event Name</th>
                <th style={{backgroundColor:'red'}}>Total Ticket Count</th>
                <th style={{backgroundColor:'red'}}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(eventTotals).map(
                ([eventName, eventTotal], index) => (
                  <tr key={index}>
                    <td>{eventName}</td>
                    <td>{eventTotal.totalTicketCount}</td>
                    <td>{eventTotal.totalAmount.toFixed(2)}/-</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <br /><br /><h1 className="text-center">Booking Details</h1> <br/>
      {/* <h2 className="text-center">Search by Customer Name</h2> */}
      <div className="form-group row">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Enter customer name..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              const filteredBookings = bookings.filter((booking) =>
                booking.userName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              );
              setBookings(filteredBookings);
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{backgroundColor:'red'}}>S.No</th>
              <th style={{backgroundColor:'red'}}>Customer Name</th>
              <th style={{backgroundColor:'red'}}>Event Name</th>
              <th style={{backgroundColor:'red'}}>Ticket Count</th>
              <th style={{backgroundColor:'red'}}>Ticket Amount Paid</th>
              <th style={{backgroundColor:'red'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.id}>
                <td>{index + 1}</td>
                <td>{booking.userName}</td>
                <td>{booking.eventName}</td>
                <td>{booking.numTickets}</td>
                <td>{booking.totalAmount}/-</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openModal(booking)}
                  >
                    View
                  </button>{" "}
                  <button
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Booking Modal"
        style={{
          overlay: { zIndex: 999 },
          content: { width: "90%", maxWidth: "600px", margin: "0 auto" },
        }}
      >
        {selectedBooking && (
          <div className="modal-content">
            <div className="modal-header">
              <hr />
              <h2 className="modal-title">
                <u>Booking Details</u>
              </h2>
              <hr />
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
              <br />
              <p>
                <strong>Customer Name: -</strong>
                {selectedBooking.userName}
              </p>
              <p>
                <strong>Email: -</strong> {selectedBooking.email}
              </p>
              <p>
                <strong>Contact Number: -</strong> {selectedBooking.contact}
              </p>
              <p>
                <strong>Event Name: -</strong> {selectedBooking.eventName}
              </p>
              <p>
                <strong>Ticket Count: -</strong> {selectedBooking.numTickets}
              </p>
              <p>
                <strong>Ticket Amount Paid: -</strong> Rs -{" "}
                {selectedBooking.totalAmount}/-
              </p>
              <br />
              <hr />
              <h2>Edit Details</h2>
              <hr />
              <div className="form-group">
                <label htmlFor="editedUserName">Customer Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="editedUserName"
                  name="userName"
                  value={editedBooking.userName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editedEmail">Email:</label>
                <input
                  type="text"
                  className="form-control"
                  id="editedEmail"
                  name="email"
                  value={editedBooking.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editedContact">Contact Number:</label>
                <input
                  type="text"
                  className="form-control"
                  id="editedContact"
                  name="contact"
                  value={editedBooking.contact}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editedNumTickets">Ticket Count:</label>
                <input
                  type="text"
                  className="form-control"
                  id="editedNumTickets"
                  name="numTickets"
                  value={editedBooking.numTickets}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editedTotalAmount">Ticket Amount Paid:</label>
                <input
                  type="text"
                  className="form-control"
                  id="editedTotalAmount"
                  name="totalAmount"
                  value={editedBooking.totalAmount}
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
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
