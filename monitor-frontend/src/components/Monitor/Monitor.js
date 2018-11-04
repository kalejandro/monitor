import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import { startMonitor, getMonitorInfo } from '../../actions';

export class Monitor extends Component {
  constructor(props) {
    super(props);
    this.start = this.start.bind(this);
  }

  componentDidMount() {
    this.props.getMonitorInfo();
  }

  start() {
    this.props.startMonitor();
  }

  render() {
    const {
      uri,
      serverSelectionTimeout,
      updateFrequency,
      fetching
    } = this.props.monitor;

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
              { fetching &&
                <Loader active />
              }
            </Transition.Group>
            <MonitorInfo
              uri={uri}
              serverSelectionTimeout={serverSelectionTimeout}
              updateFrequency={updateFrequency}
              fetching={fetching}
            />
            <Divider hidden />
            <Button primary icon
              id='start-button'
              labelPosition='left'
              size='small'
              floated='right'
              disabled={fetching}
              onClick={this.start}
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
    fetching: PropTypes.bool.isRequired
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
    getMonitorInfo: () => dispatch(getMonitorInfo())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
