const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const app = express();

const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const eventFilePath = path.join(__dirname, "event.json");
const bookingFilePath = path.join(__dirname, "booking.json");

// Book an event
app.post("/api/bookings", async (req, res) => {
  const newBooking = req.body;
  newBooking.id = Date.now(); // Generate a unique ID for the booking

  try {
    // Generate QR code data
    const qrCodeData = JSON.stringify(newBooking);

    // Generate QR code image data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);

    // Send confirmation email with embedded QR code image
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use a valid email service
      auth: {
        user: "vinayaksawant0312@gmail.com", // Replace with your Gmail email
        pass: "pbnyfgivabxymtco", // Replace with your Gmail password
      },
    });

    const qrCodeBase64 = qrCodeDataURL.split(",")[1];
    const mailOptions = {
      from: "vinayaksawant0312@gmail.com",
      to: newBooking.email,
      subject: "Booking Confirmation",
      html: `<p>Thank you for booking a ticket for ${newBooking.eventName}. Your ticket details: ...</p>`,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeDataURL.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    // Update booking file after sending email
    fs.readFile(bookingFilePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const existingBookings = JSON.parse(data);
      existingBookings.push(newBooking);

      fs.writeFile(bookingFilePath, JSON.stringify(existingBookings), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.json({ success: true });
      });
    });
  } catch (error) {
    console.error("Error confirming booking and sending email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//update event
app.put("/api/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const updatedBooking = req.body;

  fs.readFile(bookingFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const existingBookings = JSON.parse(data);
      const updatedBookings = existingBookings.map((booking) => {
        if (booking.id === bookingId) {
          return { ...booking, ...updatedBooking };
        }
        return booking;
      });

      fs.writeFile(bookingFilePath, JSON.stringify(updatedBookings), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.json({ success: true });
      });
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Error parsing JSON data" });
    }
  });
});

// Get list of events
app.get("/api/events", (req, res) => {
  fs.readFile(eventFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const events = JSON.parse(data);
    res.json(events);
  });
});

// Get list of bookings
app.get("/api/bookings", (req, res) => {
  fs.readFile(bookingFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const bookings = JSON.parse(data);
      res.json(bookings);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Error parsing JSON data" });
    }
  });
});

// Delete a booking by ID
app.delete("/api/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);

  fs.readFile(bookingFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const existingBookings = JSON.parse(data);
      const updatedBookings = existingBookings.filter(
        (booking) => booking.id !== bookingId
      );

      fs.writeFile(bookingFilePath, JSON.stringify(updatedBookings), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.json({ success: true });
      });
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Error parsing JSON data" });
    }
  });
});
//manage event create, edit and delete
// Create a new event
app.post("/api/events", (req, res) => {
  const newEvent = {
    id: Date.now(),
    eventName: req.body.eventName,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    description: req.body.description,
    artist: req.body.artist, // Include artist field
    ticketPrice: req.body.ticketPrice, // Include ticketPrice field
  };

  fs.readFile(eventFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const existingEvents = JSON.parse(data);
    existingEvents.push(newEvent);

    fs.writeFile(eventFilePath, JSON.stringify(existingEvents), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json({ success: true });
    });
  });
});

// Update an event
app.put("/api/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id, 10);

  const updatedEvent = {
    id: eventId,
    eventName: req.body.eventName,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    description: req.body.description,
    artist: req.body.artist,
    ticketPrice: req.body.ticketPrice,
  };

  fs.readFile(eventFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const existingEvents = JSON.parse(data);
      const updatedEvents = existingEvents.map((event) => {
        if (event.id === eventId) {
          return updatedEvent;
        }
        return event;
      });

      fs.writeFile(eventFilePath, JSON.stringify(updatedEvents), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.json({ success: true });
      });
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Error parsing JSON data" });
    }
  });
});

app.delete("/api/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);

  fs.readFile(bookingFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const existingBookings = JSON.parse(data);
      const updatedBookings = existingBookings.filter(
        (booking) => booking.id !== bookingId
      );

      fs.writeFile(bookingFilePath, JSON.stringify(updatedBookings), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        console.log(`Booking ${bookingId} deleted successfully.`);
        res.json({ success: true });
      });
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Error parsing JSON data" });
    }
  });
});

app.delete("/api/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id);

  fs.readFile(eventFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const events = JSON.parse(data);
    const updatedEvents = events.filter((event) => event.id !== eventId);

    fs.writeFile(eventFilePath, JSON.stringify(updatedEvents), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json({ success: true });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
