import { Modal } from 'antd';

export const ModalError = ({ open, onOk }) => {
    return (
        <Modal
            title="Fuera de servicio"
            closable={false}
            open={open}
            onOk={onOk}
            cancelButtonProps={{ style: { display: 'none' } }}
        >
            <p>Lo sentimos, en este momento el servicio no está disponible</p>
            <p>Por Favor intentelo más tarde</p>
        </Modal>);
}