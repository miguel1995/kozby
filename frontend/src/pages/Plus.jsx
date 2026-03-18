import MenuBar from "../components/MenuBar"
import { PLUS_MENU_ITEMS } from "../utils/constants"
import { Divider } from "antd"
import { useNavigate } from "react-router"
import { UnorderedListOutlined, InboxOutlined, DollarOutlined } from '@ant-design/icons';

export const Plus = () => {
    const navigate = useNavigate()

    const getIcon = (icon) => {
        if (icon === 'active') return <UnorderedListOutlined />;
        if (icon === 'archived') return <InboxOutlined />;
        if (icon === 'tx') return <DollarOutlined />;
        return null;
    };

    return (
        <div className="plus-container">
            <div className="plus-welcome-text">Te damos la bienvenida de Nuevo</div>

            {PLUS_MENU_ITEMS.map((item) => (
                <div
                    key={item.key || item.path || item.label}
                    className="plus-menu-item-label"
                    onClick={() => navigate(item.path)}
                >
                    <span className="plus-menu-item-icon">{getIcon(item.icon)}</span>
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    )
}
