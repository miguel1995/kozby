import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Plus } from './pages/Plus'

import Productos from './pages/Productos'
import FormProducto from './pages/FormProducto'
import FormInicio from './pages/FormInicio';
import MainLayout from './layouts/MainLayout';
import ProcesoPagos from './pages/ProcesoPagos';
import NuevaOrden from './pages/NuevaOrden';
import Cobro from './pages/Cobro';
import Transacciones from './pages/transacciones';
import TransaccionDetalle from './pages/TransaccionDetalle';
import Descuentos from './pages/Descuentos';
import Usuarios from './pages/Usuarios';
import PaymentMethod from './pages/PaymentMethod';

import { OrderProvider } from './context/OrderContext';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';




function App() {

  return (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio-sesion" />} />

          <Route path="/transacciones" element={
            <MainLayout>
              <Transacciones />
            </MainLayout>
          } />
          <Route path="/descuentos" element={
            <MainLayout>
              <Descuentos />
            </MainLayout>
          } />
          <Route path="/productos" element={
            <MainLayout>
              <Productos />
            </MainLayout>
          } />

          <Route path="/usuarios" element={
            <MainLayout>
              <Usuarios />
            </MainLayout>
          } />


          <Route path="/transacciones/:id" element={
            <MainLayout>
              <TransaccionDetalle />
            </MainLayout>
          } />

          <Route path="/nuevo-producto" element={<FormProducto />} />
          <Route path="/editar-producto/:id" element={<FormProducto isEditMode={true} />} />
          <Route path="/mas" element={
            <MainLayout>
              <Plus />
            </MainLayout>
          } />
          <Route path="/inicio-sesion" element={<FormInicio />} />
          <Route path="/productos/archivados" element={
            <MainLayout>
              <Productos />
            </MainLayout>
          } />
          <Route path="/proceso-pagos" element={
            <MainLayout>
              <ProcesoPagos />
            </MainLayout>
          } />
          <Route path="/nueva-orden/:id" element={
            <MainLayout>
              <NuevaOrden />
            </MainLayout>
          } />
          <Route path="/cobro" element={
            <MainLayout>
              <Cobro />
            </MainLayout>
          } />
          <Route path="/metodo-pago" element={
            <MainLayout>
              <PaymentMethod />
            </MainLayout>
          } />

        </Routes>
      </BrowserRouter>
    </OrderProvider>
  );
}

export default App;
