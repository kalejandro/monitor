import React from 'react';

import Error from '../Error';

const NotFound = () => {
  return(
    <Error
      header='404 error'
      subHeader='Page not found'
      message='This is not the web page you are looking for.' 
    />
  );
};

export default NotFound;
