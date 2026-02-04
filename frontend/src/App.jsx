import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Productos from './pages/Productos'
import FormProducto from './pages/FormProducto'
import FormInicio from './pages/FormInicio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/productos" />} />


        <Route path="/productos" element={<Productos />} />
          <Route path="/nuevo-producto" element={<FormProducto />} />
          <Route path="/editar-producto/:id" element={<FormProducto isEditMode={true} />} />
          <Route path="/inicio-sesion" element={<FormInicio />} />



        <Route path="/productos/archivados" element={<Productos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
