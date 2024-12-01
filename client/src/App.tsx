import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './employee/authentication/SignUp'
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <SignUp />
        </Routes>
    </div>
    </Router>
  )
}

export default App 
