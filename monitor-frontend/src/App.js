import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import './App.css';

import NotFound from './components/NotFound';

export class App extends Component {
  render() {
    return (
      <Switch>
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default withRouter(App);
