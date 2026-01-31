import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';


const Loader = ({ message = '' }) => {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      className="loader-container"
    >
      <Spin
        indicator={
          <LoadingOutlined
            spin
            className="loader-icon"
          />
        }
      />

      <span className="loader-text">
        {message}
      </span>
    </Flex>
  );
};

export default Loader;
