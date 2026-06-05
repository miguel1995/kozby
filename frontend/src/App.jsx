import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Plus } from './pages/Plus'

import Productos from './pages/Productos'
import FormProducto from './pages/FormProducto'
import FormInicio from './pages/FormInicio';
import FormUsuario from './pages/FormUsuario';
import MainLayout from './layouts/MainLayout';
import ProcesoPagos from './pages/ProcesoPagos';
import NuevaOrden from './pages/NuevaOrden';
import Cobro from './pages/Cobro';
import Transacciones from './pages/transacciones';
import TransaccionDetalle from './pages/TransaccionDetalle';
import Reembolso from './pages/Reembolso';
import Descuentos from './pages/Descuentos';
import Usuarios from './pages/Usuarios';
import Ajustes from './pages/Ajustes';
import PaymentMethod from './pages/PaymentMethod';
import PaymentResult from './pages/PaymentResult';

import { OrderProvider } from './context/OrderContext';
import { canAccess } from './utils/authUtils';
import AddDiscount from './pages/AddDiscount';


function App() {

  return (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio-sesion" />} />
          <Route path="/nuevo-usuario" element={<FormUsuario />} />
          <Route path="/editar-usuario/:id" element={<FormUsuario isEditMode={true} />} />


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
          <Route path="/ajustes" element={
            canAccess() ? (
              <MainLayout>
                <Ajustes />
              </MainLayout>
            ) : (
              <Navigate to="/inicio-sesion" />
            )
          } />

          <Route path="/productos" element={
            <MainLayout>
              <Productos />
            </MainLayout>
          } />

          <Route path="/usuarios" element={
            canAccess() ? (
              <MainLayout>
                <Usuarios />
              </MainLayout>
            ) : (
              <Navigate to="/inicio-sesion" />
            )
          } />


          <Route path="/transacciones/:id" element={
            <MainLayout>
              <TransaccionDetalle />
            </MainLayout>
          } />
          <Route path="/transacciones/:id/reembolso" element={
            <MainLayout>
              <Reembolso />
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
          <Route path="/editar-nueva-orden/:id" element={
            <MainLayout>
              <NuevaOrden isEditMode={true} />
            </MainLayout>
          } />
          <Route path="/cobro" element={
            <MainLayout>
              <Cobro />
            </MainLayout>
          } />
          <Route path="/resultado-pago/:transactionId" element={
            <MainLayout>
              <PaymentResult />
            </MainLayout>
          } />
          <Route path="/metodo-pago" element={
            <MainLayout>
              <PaymentMethod />
            </MainLayout>
          } />

          <Route path="/agregar-descuento" element={
            <MainLayout>
              <AddDiscount />
            </MainLayout>
          } />

        </Routes>
      </BrowserRouter>
    </OrderProvider>
  );
}

export default App;
