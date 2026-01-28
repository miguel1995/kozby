import { Button } from 'antd';

const SubmitButton = ({ text, onClick, disabled }) => {
    return (
        <Button
            onClick={onClick}
            className="create-product-button"
            disabled={disabled}  // <-- aquí el cambio
        >
            {text}
        </Button>
    );
};

export default SubmitButton;
