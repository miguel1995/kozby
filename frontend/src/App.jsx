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

import { OrderProvider } from './context/OrderContext';

function App() {
  return (
      <OrderProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/transacciones" element={
          <MainLayout>
            <Transacciones />
          </MainLayout>
        } />
        <Route path="/" element={<Navigate to="/proceso-pagos" />} />
        <Route path="/productos" element={
          <MainLayout>
            <Productos />
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
      </Routes>

    </BrowserRouter>
      </OrderProvider>
  );
}

export default App;
