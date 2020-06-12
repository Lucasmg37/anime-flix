import React from 'react';
import 'sass/UI.scss';

export default function UIinputText(props) {
  return (
    <input
      className={`UIinputText ${props.className}`}
      placeholder={props.placeholder}
      onChange={e => props.onChange(e.target.value)}
      value={props.value}
      type={props.type ? props.type : 'text'}
    />
  );
}