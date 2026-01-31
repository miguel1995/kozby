import { Modal } from 'antd';
import Loader from '../Loader';

export const ModalLoader = ({ loading, message }) => {
  return (
    <Modal
        footer={null}
        title=""
        closable={false}
        open={loading}
      >
          <Loader message={message} />

      </Modal>
  );
};