import React from 'react';
import { Input } from 'antd';




export const NumericInput = props => {
  const { value, onChange, name, maxLength, placeholder="" } = props;
  

  const handleChange = e => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      onChange({target: {name: name, value: inputValue}});
    }
  };
  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    let valueTemp = value ?? '';
    if (
      valueTemp.length > 0 &&
      (valueTemp.charAt(valueTemp.length - 1) === '.' || valueTemp === '-')
    ) {
      valueTemp = valueTemp.slice(0, -1);
    }
    const normalized = valueTemp.replace(/0*(\d+)/, '$1');
    onChange({ target: { name, value: normalized } });
  };

  return (
    <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength || 8}
        inputMode={'decimal'}

      />
  );
};
