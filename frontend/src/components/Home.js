import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Button, Modal, Form } from "react-bootstrap";
import "./CustomStyles.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [numTickets, setNumTickets] = useState(1);
  const [ticketPrice, setTicketPrice] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [artist, setArtist] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    axios
      .get("https://eventplaza.onrender.com/api/events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const formatTime = (timeString) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(`2023-08-15T${timeString}`).toLocaleTimeString(
      "en-US",
      options
    );
  };

  const handleTicketCountChange = (newCount) => {
    setNumTickets(newCount);
    setTotalAmount(newCount * ticketPrice);
  };

  const handleBookTicket = (event) => {
    setSelectedEvent(event);
    setTicketPrice(event.ticketPrice);
    setArtist(event.artist);
    setTotalAmount(numTickets * event.ticketPrice);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setUserName("");
    setEmail("");
    setContact("");
    setNumTickets(1);
    setTicketPrice(0);
    setArtist("");
    setTotalAmount(0);
  };

  const isBookingValid = () => {
    return (
      userName.trim() !== "" &&
      email.trim() !== "" &&
      contact.trim() !== "" &&
      numTickets > 0
    );
  };

  const handleConfirmBooking = () => {
    if (isBookingValid()) {
      const bookingData = {
        eventName: selectedEvent.eventName,
        userName,
        email,
        contact,
        numTickets,
        totalAmount,
      };

      axios
        .post("https://eventplaza.onrender.com/api/bookings", bookingData)
        .then((response) => {
          console.log("Booking confirmed:", response.data);
          handleCloseModal();
          alert("Booking saved successfully!");
        })
        .catch((error) => {
          console.error("Error confirming booking:", error);
        });
    } else {
      alert(
        "Please fill in all required fields before confirming the booking."
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">UPCOMING EVENTS</h2>
      <br />
      <Row>
        {events.map((event) => (
          <Col key={event.id} lg={4} md={6} sm={12} className="mb-4">
            <Card className="h-100 shadow-sm" bg="light">
              <div className="card-img-top bg-purple p-4 text-center">
                <h4 className="text-light display-5 single-line-text">
                  {event.eventName}
                </h4>
                <Card.Text style={{ color: "yellow" }}>
                  Artist: -
                  <b>{event.artist}</b>
                </Card.Text>
                <div className="text-light">
                  {event.date.split("-").reverse().join("-")} <br />
                  {formatTime(event.time)}<br/><hr/>
                  {event.location}<br/><br/>
                </div>
              </div>
              <Card.Body className="d-flex flex-column align-items-center justify-content-between card-content">
                <Card.Text className="text-center">
                  {event.description}
                </Card.Text>
                <div className="text-center">
                  <Card.Text className="mb-2">
                
                    <span className="ticket-price">
                      Ticket Price: Rs - {event.ticketPrice}/-
                    </span>
                  </Card.Text>
                  <div className="card-button">
                    <Button
                      variant="info"
                      onClick={() => handleBookTicket(event)}
                    >
                      Buy Ticket
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Book Ticket for {selectedEvent && selectedEvent.eventName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="userName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="contact">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your contact number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="numTickets">
              <Form.Label>Number of Tickets</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={numTickets}
                onChange={(e) =>
                  handleTicketCountChange(parseInt(e.target.value))
                }
              />
            </Form.Group>
            <Form.Group controlId="totalAmount">
              <Form.Label>Total Amount: Rs - {totalAmount}</Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
