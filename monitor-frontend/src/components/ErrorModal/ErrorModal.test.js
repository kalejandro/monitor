import React from 'react';
import { shallow } from 'enzyme';

import { ErrorModal } from './ErrorModal';
import { Header, Modal, Button } from 'semantic-ui-react';

const setup = propOverrides => {
  const props = Object.assign({
    open: true,
    header: 'The header',
    content: 'The content',
    closeModal: jest.fn()
  }, propOverrides);

  const wrapper = shallow(<ErrorModal {...props} />);

  return {
    wrapper,
    props
  };
};

describe('ErrorModal', () => {
  it('should render the modal with the right props', () => {
    const { wrapper, props } = setup();
    const modal = wrapper.find(Modal);
    const header = modal.find(Header);
    const content = modal.find(Modal.Content);

    expect(modal.prop('open')).toBe(props.open);
    expect(header.prop('content')).toBe(props.header);
    expect(content.contains(props.content)).toBe(true);
  });

  it('should call the close function', () => {
    const { wrapper, props } = setup();

    wrapper.find(Button).simulate('click');
    expect(props.closeModal).toHaveBeenCalled();
  });
});
