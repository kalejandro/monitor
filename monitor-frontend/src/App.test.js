import React from 'react';
import { shallow } from 'enzyme';

import { App } from './App';

const setup = propOverrides => {
  const props = Object.assign({
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
});
