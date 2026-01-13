import { Button } from 'antd';

const SubmitButton = ({ text, onClick }) => {
    return (
        <Button
            onClick={onClick}
            className="create-product-button"
        >{text}</Button>
    );
};

export default SubmitButton;