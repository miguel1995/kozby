import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Productos from './pages/Productos'
function App() {

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/productos" />} />
          <Route path="/productos" element={<Productos />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
