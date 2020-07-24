import React from 'react';
import 'sass/UI.scss';

export default function UIinputText({className, onChange, type, value, placeholder, ...rest}) {
  return (
    <input
      className={`UIinputText ${className}`}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      defaultValue={value}
      type={type ? type : 'text'}
      {...rest}
    />
  );
}