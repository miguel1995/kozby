import React, { useState } from 'react';
import { AppstoreOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router';

const MenuBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {

        if (path === '/mas') {
            return location.pathname === '/mas'
                || location.pathname === '/productos'
                || location.pathname === '/productos/archivados'
                || location.pathname === '/transacciones'
                || location.pathname === '/descuentos';
        }
        if (path === '/proceso-pagos') 
            return location.pathname === '/proceso-pagos'
                || location.pathname === '/cobro'
                || location.pathname === '/metodo-pago';

        return false;
    };


    return (
        <nav className="main-layout-bottom-bar">
            <button
                type="button"
                className={`main-layout-nav-item ${isActive('/proceso-pagos') ? 'active' : ''}`}
                onClick={() => navigate('/proceso-pagos')}
                aria-label="Proceso de pagos"
            >
                <AppstoreOutlined />
                <span>Proceso de pagos</span>
            </button>

            <button
                type="button"
                className={`main-layout-nav-item ${isActive('/mas') ? 'active' : ''}`}
                onClick={() => navigate('/mas')}
                aria-label="Más"
            >
                <MenuOutlined />
                <span>Más</span>
            </button>
        </nav>
    );
};
export default MenuBar;