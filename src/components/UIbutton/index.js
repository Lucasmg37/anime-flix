import React from 'react';
import 'sass/UI.scss';

export default function UIbutton(props) {
  return (
    <button
      className={`UIbutton ${props.className}`}
      onClick={() => props.onClick && props.onClick()}
    >{props.children}</button>
  );
}