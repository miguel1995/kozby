import { Button } from 'antd';

export const ButtonSecundary = ({ onClick, label }) => {
    return (
        <Button
            type="default"
            onClick={onClick}
            className='button-secundary'
        >{label}
        </Button>
    );
};