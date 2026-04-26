import React from 'react';
import { Input } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

export const SearchInput = ({ value, onChange, placeholder = 'Buscar', className = '' }) => (
  <Input
    placeholder={placeholder}
    className={className}
    prefix={<SearchOutlined />}
    suffix={value ? <CloseOutlined onClick={() => onChange('')} style={{ cursor: 'pointer' }} /> : null}
    value={value}
    onChange={e => onChange(e.target.value)}
    allowClear={false}
    autoFocus={false}
  />
);
