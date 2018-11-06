import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './App.css';

import NotFound from './components/NotFound';
import Monitor from './components/Monitor';
import Error from './components/Error';
import DashboardContainer from './components/DashboardContainer';

export class App extends Component {
  render() {
    const { error, errorMessage } = this.props;

    return (
      <React.Fragment>
        {error ? (
          <Error
            header='STOMP error'
            subHeader='STOMP client reported an error'
            message={errorMessage}
          />
        ) : (
          <Switch>
            <Route exact path='/' component={Monitor} />
            <Route
              path='/dashboard'
              component={DashboardContainer}
            />
            <Route component={NotFound} />
          </Switch>
        )}
      </React.Fragment>
    );
  }
}

App.propTypes = {
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
    error: state.stomp.error,
    errorMessage: state.stomp.errorMessage
  };
};

export default withRouter(connect(mapStateToProps)(App));
