import { Button } from 'antd';

export const SubmitButton = ({ text, onClick, disabled }) => {
    return (
        <Button
            onClick={onClick}
            className="submit-product-button"
            disabled={disabled}  
        >
            {text}
        </Button>
    );
};
