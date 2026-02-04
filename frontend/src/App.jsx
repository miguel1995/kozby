import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Plus } from './pages/Plus'

import Productos from './pages/Productos'
import FormProducto from './pages/FormProducto'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/productos" />} />


        <Route path="/productos" element={<Productos />} />
          <Route path="/nuevo-producto" element={<FormProducto />} />
          <Route path="/editar-producto/:id" element={<FormProducto isEditMode={true} />} />
          <Route path="/mas" element={<Plus />} />



        <Route path="/productos/archivados" element={<Productos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
