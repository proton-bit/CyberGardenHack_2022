import { useState } from 'react'
import React from 'react';
import {  BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import AppRouted from "./components/AppRouted";



function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
            

    <BrowserRouter>

      <AppRouted/>
      
    </BrowserRouter>
</div>
  )
}

export default App
