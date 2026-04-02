import { PLUS_MENU_ITEMS } from "../utils/constants"
import { useNavigate } from "react-router"

import { UnorderedListOutlined, InboxOutlined, DollarOutlined, LogoutOutlined, PercentageOutlined, UserOutlined } from '@ant-design/icons';

import { Divider } from 'antd';

export const Plus = () => {
    const navigate = useNavigate();

    const icons = {
        active: <UnorderedListOutlined />,
        archived: <InboxOutlined />,
        tx: <DollarOutlined />,
        discount: <PercentageOutlined />,
        logout: <LogoutOutlined />,
        users: <UserOutlined />
    };

    const getIcon = (icon) => {
        return icons[icon] || null;
    };

    return (
        <div className="plus-container">
            <div className="plus-welcome-text">Te damos la bienvenida de Nuevo</div>

            {PLUS_MENU_ITEMS.map((item) => (

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
