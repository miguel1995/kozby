import React from 'react';
import MenuBar from '../components/MenuBar';

const MainLayout = ({ children }) => {
   

    return (
        <div className="main-layout">
            <div className="main-layout-content">
                {children}
            </div>
            <MenuBar />
        </div>
    );
};

export default MainLayout;
