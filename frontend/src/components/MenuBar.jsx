import React, { useState } from 'react';
import {

  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useNavigate } from 'react-router';

const MenuBar = () => {



  const items = [

    {
      key: 'sub1',
      label: 'Artículos',
      icon: <BookOutlined className='icon-book'/>,
      children: [
        {
          key: '1',
          label: 'Surtido de Artículos',
          onClick: () => {
            navigate('/productos', { replace: false });
            navigate(0);
          }
        },
        {
          key: '2',
          label: 'Artículos Archivados',
          onClick: () => {
            navigate('/productos/archivados', { replace: false });
            navigate(0);
          }
        }

      ],
    }
  ];

  const navigate = useNavigate();


  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div style={{ width: 260, marginTop: 50, marginLeft: 40 }}>
      <Button
        type="primary"
        className="menu-btn"
        size="large"
        shape="round"
        onClick={toggleCollapsed}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        Menú
      </Button>


      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};
export default MenuBar;