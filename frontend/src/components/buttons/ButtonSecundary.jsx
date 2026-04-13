import { Button } from 'antd';

export const ButtonSecundary = ({ onClick, label, disabled, loading }) => {
    return (
        <Button
            type="default"
            onClick={onClick}
            className='button-secundary'
            disabled={disabled}
            loading={loading}
        >{label}
        </Button>
    );
};