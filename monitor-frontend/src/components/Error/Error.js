import React from 'react';
import { Header, Divider, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Error = ({header, subHeader, message}) => {
  return(
    <div className='error'>
      <Header as='h1' textAlign='center'>
        {header}
        <Header.Subheader>
          {subHeader}
        </Header.Subheader>
      </Header>
      <Divider hidden />
      <Container as='h3' textAlign='center' id='message'>
        {message}
      </Container>
    </div>
  );
};

Error.propTypes = {
  header: PropTypes.string.isRequired,
  subHeader: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default Error;
