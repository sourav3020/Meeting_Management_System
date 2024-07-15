import React from 'react';

const Notification = ({ type, message }) => (
  <div className={`notification ${type}`}>
    <p>{message}</p>
  </div>
);

export default Notification;
