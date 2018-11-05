import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'semantic-ui-react';

import { App } from './App';
import Error from './components/Error';

const setup = propOverrides => {
  const props = Object.assign({
    error: false,
    errorMessage: ''
  }, propOverrides);

  const wrapper = shallow(<App {...props} />);

  return {
    wrapper,
    props
  };
};

describe('App', () => {
  it('should render', () => {
    const { wrapper } = setup();
  });

  describe('Messaging', () => {
    it('should display stomp errors', () => {
      const { wrapper, props } = setup({
        error: true,
        errorMessage: 'The error message'
      });

      const error = wrapper.find(Error);
      expect(error).toHaveLength(1);
      expect(error.prop('message')).toBe(props.errorMessage);
    });
  });
});
