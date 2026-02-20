import { Button } from 'antd';
import { useEffect } from 'react';
export const SubmitButton = ({ text, onClick, disabled, style }) => {

    return (
        <Button
            onClick={onClick}
            className="submit-product-button"
            disabled={disabled}
            style={style}
        >
            {text}
        </Button>
    );
};
