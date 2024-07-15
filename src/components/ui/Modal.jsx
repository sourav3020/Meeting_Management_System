// src/components/ui/Modal.jsx
import React from 'react';

const Modal = ({ type, message }) => (
  <div className={`modal ${type}`}>
    <p>{message}</p>
    <button onClick={() => window.location.reload()}>Close</button>
  </div>
);

export default Modal;
