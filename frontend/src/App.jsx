import { useState } from 'react'
import './App.css'

function App() {
  return (
    <>
      <div className="container">
        <h1>Weather Stack</h1>
        <div className="input-container">
          <h3>City</h3>
          <input type="text" placeholder="Enter city name" />
          <h3>Period</h3>
          <select>
            <option value="1 day">1 day</option>
            <option value="2 days">2 days</option>
            <option value="3 days">3 days</option>
            <option value="4 days">4 days</option>
            <option value="5 days">5 days</option>
            <option value="6 days">6 days</option>
            <option value="7 days">7 days</option>
          </select>
          <button>Get Weather</button>
        </div>
      </div>
    </>
  )
}

export default App
