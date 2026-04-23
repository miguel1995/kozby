import { PLUS_MENU_ITEMS_ADMIN, PLUS_MENU_ITEMS_EMPLOYEE } from "../utils/constants"
import { useNavigate } from "react-router"

import { UnorderedListOutlined, InboxOutlined, DollarOutlined, LogoutOutlined, PercentageOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

import { Divider } from 'antd';
import { canAccess, getUserName } from "../utils/authUtils";

export const Plus = () => {
    const navigate = useNavigate();



    const menuItems = canAccess() ? PLUS_MENU_ITEMS_ADMIN : PLUS_MENU_ITEMS_EMPLOYEE;

    const icons = {
        active: <UnorderedListOutlined />,
        archived: <InboxOutlined />,
        tx: <DollarOutlined />,
        discount: <PercentageOutlined />,
        settings: <SettingOutlined />,
        logout: <LogoutOutlined />,
        users: <UserOutlined />
    };

    const getIcon = (icon) => {
        return icons[icon] || null;
    };

    return (
        <div className="plus-container">
            <div className="plus-welcome-text">Te damos la bienvenida de Nuevo {getUserName()}</div>
            
            {menuItems.map((item) => (

                <div key={item.key}>
                    <div
                        className="plus-menu-item-label"
                        onClick={() => {
                            if (item.icon === 'logout') {
                                localStorage.clear();
                                navigate('/inicio-sesion');
                                
                                
                            } else {
                                navigate(item.path);
                            }
                        }}                >
                        <span className="plus-menu-item-icon">{getIcon(item.icon)}</span>
                        <span>{item.label}</span>
                    </div>
                    <Divider className="plus-menu-item-divider" />

                </div>
            ))}
        </div>
    )
}
