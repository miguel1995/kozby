import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Productos from './pages/Productos'
import NuevoProducto from './pages/NuevoProducto'

function App() {

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/productos" />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/nuevo-producto" element={<NuevoProducto />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
