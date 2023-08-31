import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Booking from './components/Booking';
import Manage from './components/Manage';
import CreateEvent from './components/CreateEvent';
import './App.css'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className='bg'>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/booking" element={<Booking/>} />
          <Route path="/manage" element={<Manage/>} />
          <Route path="/create" element={<CreateEvent/>} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
