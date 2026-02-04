import MenuBar from "../components/MenuBar"
import { PLUS_MENU_ITEMS } from "../utils/constants"
import { Divider } from "antd"
import { useNavigate } from "react-router"

export const Plus = () => {
    const navigate = useNavigate()
    return (
        <div className="plus-container">
            <div className="plus-welcome-text">Te damos la bienvenida de Nuevo</div>
           {/* <MenuBar /> */}
           {PLUS_MENU_ITEMS.map((item) => (
            <div key={item.key}>
                <div className="plus-menu-item-label" onClick={() => navigate(item.path)}>{item.label}</div>
                <Divider className="plus-menu-item-divider" />
            </div>
           ))}
        </div>
    )
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       