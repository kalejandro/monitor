import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Grid,
  Header,
  Divider,
  Transition,
  Loader,
  Button,
  Icon
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import MonitorInfo from './MonitorInfo';
import {
  startMonitor,
  initializeMonitor
} from '../../actions';

export class Monitor extends Component {
  constructor(props) {
    super(props);
    this.start = this.start.bind(this);
  }

  componentDidMount() {
    const { initializeMonitor } = this.props;

    initializeMonitor();
  }

  start() {
    this.props.startMonitor();
  }

  render() {
    const {
      uri,
      serverSelectionTimeout,
      updateFrequency,
      initializing,
      loading,
      started
    } = this.props.monitor;

    if (started) {
      return(
        <Redirect to='/dashboard' push={true} />
      );
    }

    return (
      <Grid centered>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h1' textAlign='center'>
              Monitor
              <Header.Subheader>Info</Header.Subheader>
            </Header>
            <Divider hidden />
            <Transition.Group animation='fade' duration={500}>
              { initializing &&
                <Loader active />
              }
            </Transition.Group>
            <MonitorInfo
              uri={uri}
              serverSelectionTimeout={serverSelectionTimeout}
              updateFrequency={updateFrequency}
            />
            <Divider hidden />
            <Button primary icon
              id='start-button'
              labelPosition='left'
              size='small'
              floated='right'
              disabled={initializing}
              onClick={this.start}
              loading={loading}
            >
              <Icon name='play' />
              Start
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Monitor.propTypes = {
  monitor: PropTypes.shape({
    uri: PropTypes.string.isRequired,
    serverSelectionTimeout: PropTypes.number.isRequired,
    updateFrequency: PropTypes.number.isRequired,
    initializing: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    started: PropTypes.bool.isRequired
  }).isRequired
};

const mapStateToProps = state => {
  return {
    monitor: state.monitor
  };
};

const mapDispatchToProps = dispatch => {
  return {
    startMonitor: () => dispatch(startMonitor()),
    initializeMonitor: () => dispatch(initializeMonitor())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
