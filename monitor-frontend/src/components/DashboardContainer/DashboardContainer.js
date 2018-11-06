import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from 'chart.js';
import { Redirect } from 'react-router-dom';
import { Transition, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Dashboard from './Dashboard';
import Timeout from './Timeout';
import Error from '../Error';
import { stopMonitor } from '../../actions';

export class DashboardContainer extends Component {
  componentDidMount() {
    Chart.defaults.global.defaultFontFamily =
      'Lato, "Helvetica Neue", Arial, Helvetica, sans-serif';
    Chart.defaults.global.defaultFontSize = 15;
  }

  render() {
    const {
      started,
      uri,
      currentStats,
      collectedStats,
      loading,
      timeout,
      error,
      errorMessage,
      stopMonitor
    } = this.props;

    if (!started) {
      return(<Redirect to='/' push={true} />);
    }

    if (timeout) {
      return(
        <Timeout
          loading={loading}
          cancel={stopMonitor}
        />
      );
    }

    return(
      <React.Fragment>
        {error ? (
          <Error
            header='Monitor error'
            subHeader='Can not get stats'
            message={errorMessage}
          />
        ) : (
          <React.Fragment>
            <Transition.Group animation='fade' duration={500}>
              {(!collectedStats.initialized) && <Loader active size='large'/>}
            </Transition.Group>
            <Dashboard
              currentStats={currentStats}
              collectedStats={collectedStats}
              uri={uri}
              loading={loading}
              stopMonitor={stopMonitor}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

DashboardContainer.propTypes = {
  started: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  uri: PropTypes.string.isRequired,
  currentStats: PropTypes.object.isRequired,
  collectedStats: PropTypes.object.isRequired,
  timeout: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  stopMonitor: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    started: state.monitor.started,
    loading: state.monitor.loading,
    uri: state.monitor.uri,
    currentStats: state.stats.current,
    collectedStats: state.stats.collected,
    timeout: state.dashboard.timeout,
    error: state.dashboard.error,
    errorMessage: state.dashboard.errorMessage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    stopMonitor: () => dispatch(stopMonitor())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
