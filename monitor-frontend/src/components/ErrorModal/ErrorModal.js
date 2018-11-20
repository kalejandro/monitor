import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Modal, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  closeModal
} from '../../actions';

export const ErrorModal = ({ header, content, open, closeModal }) => {
  return(
    <Modal
      open={open}
      basic
      size='small'
    >
      <Header icon='warning sign' content={header} />
      <Modal.Content>
        <h3>{content}</h3>
      </Modal.Content>
      <Modal.Actions>
        <Button autoFocus color='grey' onClick={closeModal} inverted>
          <Icon name='checkmark' /> OK
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const mapStateToProps = state => {
  return {
    header: state.modal.header,
    content: state.modal.message,
    open: state.modal.open
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: () => dispatch(closeModal())
  };
};

ErrorModal.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
