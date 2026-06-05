import { Button } from 'antd';
import { useEffect } from 'react';
export const SubmitButton = ({ text, onClick, disabled, loading, style }) => {

    return (
        <Button
            onClick={onClick}
            className="submit-product-button"
            disabled={disabled}
            loading={loading}
            style={style}
        >
            {text}
        </Button>
    );
};
