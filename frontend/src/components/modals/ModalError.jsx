import { Modal } from 'antd';
import { ERROR_CODES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

export const ModalError = ({ open, errorCode, onOk }) => {

    const error = ERROR_CODES[errorCode || 500];
    const navigate = useNavigate();


    return (
        <Modal
            okText={error.label}
            title={error.title}
            closable={false}
            open={open}
            cancelButtonProps={{ style: { display: 'none' } }}
            onOk={() => {
                console.log('onOk', error);
                onOk();

                if (error.redirectPath) {
                    navigate(error.redirectPath);
                }
            }}
        >
            {error.message}
        </Modal>);
}