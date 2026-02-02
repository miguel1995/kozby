import { Button } from 'antd';


export const ButtonDanger = ({ onClick, style, label }) => {
    return (
        <Button
            type="primary"
            color='red'
            onClick={onClick}
            className='button-danger'
        >{label}</Button>
    );
};