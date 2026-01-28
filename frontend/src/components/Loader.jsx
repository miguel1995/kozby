import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

const Loader = ({ message = '' }) => {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{ minHeight: '500px' }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            spin
            style={{ fontSize: 60,
                color: '#000'
             }}
            
          />
        }
      />

      <span
        style={{
          marginTop: 12,
          color: '#000',
          fontSize: 18,
          fontWeight: 500
        }}
      >
        {message}
      </span>
    </Flex>
  );
};

export default Loader;
