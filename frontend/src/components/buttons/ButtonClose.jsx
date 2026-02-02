import { CloseOutlined } from '@ant-design/icons';


export const ButtonClose = ({ onClick }) => {
    return (
        <CloseOutlined
            className="form-producto-close-icon"
            onClick={onClick}
        />
    );
};