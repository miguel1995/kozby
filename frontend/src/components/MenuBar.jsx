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
      icon: <BookOutlined />,
      children: [
        { key: '1', 
          label: 'Surtido de Artículos',
          onClick: () => {
            console.log('Surtido de Artículos');
            navigate('/productos');
          }
        },
       
      ],
    }
  ];

  const navigate = useNavigate();


  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div style={{ width: 256 }}>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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