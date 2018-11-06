import React from 'react';
import { Loader, Divider, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const Timeout = ({loading, cancel}) => {
  return(
    <React.Fragment>
      <Loader active>
        <h3>Mongo timed out. Reconnecting...</h3>
        <Divider hidden />
        <Button primary icon labelPosition='left'
          loading={loading}
          onClick={cancel}
        >
          <Icon name='cancel' />
          Cancel
        </Button>
      </Loader>
    </React.Fragment>
  );
};

Timeout.propTypes = {
  loading: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired
};

export default Timeout;
