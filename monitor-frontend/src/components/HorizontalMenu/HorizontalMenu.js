import React, { Component } from 'react';
import { Menu, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router';

export class HorizontalMenu extends Component {
  render() {
    return (
      <React.Fragment>
        <Menu pointing secondary>
          <Menu.Item header>
            Monitor
          </Menu.Item>
        </Menu>
        <Divider hidden />
      </React.Fragment>
    );
  }
}

export default withRouter(HorizontalMenu);
