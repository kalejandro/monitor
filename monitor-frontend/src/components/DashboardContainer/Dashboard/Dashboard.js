import React from 'react';
import { Grid, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import LineChart from './LineChart';
import * as datasets from './datasets';
import chartOptions from './chartOptions';

export const Dashboard = (props) => {
  const {
    insert,
    query,
    update,
    delete_,
    getmore,
    command,
    bytesIn,
    bytesOut,
    current,
    available
  } = props.collectedStats;

  const { uptime, version } = props.currentStats;
  const { uri, loading, stopMonitor } = props;

  return(
    <Grid centered columns='equal'>

      <Grid.Row className='info'>

        <Grid.Column width={10}>
          <h3>{uri}</h3>
          <strong>Version:</strong> {version} <br />
          <strong>Uptime:</strong> {uptime}
        </Grid.Column>

        <Grid.Column width={2}>
          <Button icon
            id='stop'
            labelPosition='left'
            size='small'
            floated='right'
            loading={loading}
            onClick={stopMonitor}
          >
            <Icon name='stop' /> Stop
          </Button>
        </Grid.Column>

      </Grid.Row>

      <Grid.Row>

        <Grid.Column width={6}>
          <LineChart
            id='op-counters'
            data={[insert, query, update, delete_]}
            getDatasets={datasets.opCounters}
            options={chartOptions('OP. COUNTERS')}
            canvasId='op-counters-canvas'
          />
        </Grid.Column>

        <Grid.Column width={6}>
          <LineChart
            id='op-counters-2'
            getDatasets={datasets.opCounters2}
            data={[getmore, command]}
            options={chartOptions('OP. COUNTERS 2')}
            canvasId='op-counters2-canvas'
          />
        </Grid.Column>

      </Grid.Row>

      <Grid.Row>

        <Grid.Column width={6}>
          <LineChart
            id='network'
            getDatasets={datasets.network}
            data={[bytesIn, bytesOut]}
            options={chartOptions('NETWORK')}
            canvasId='network-canvas'
          />
        </Grid.Column>

        <Grid.Column width={6}>
          <LineChart
            id='connections'
            getDatasets={datasets.connections}
            data={[current, available]}
            options={chartOptions('CONNECTIONS')}
            canvasId='connections-canvas'
          />
        </Grid.Column>

      </Grid.Row>

    </Grid>
  );
};

Dashboard.propTypes = {
  uri: PropTypes.string.isRequired,
  currentStats: PropTypes.shape({
    uptime: PropTypes.number.isRequired,
    version: PropTypes.string.isRequired
  }).isRequired,
  collectedStats: PropTypes.shape({
    insert: PropTypes.array.isRequired,
    query: PropTypes.array.isRequired,
    update: PropTypes.array.isRequired,
    delete_: PropTypes.array.isRequired,
    command: PropTypes.array.isRequired,
    getmore: PropTypes.array.isRequired,
    bytesIn: PropTypes.array.isRequired,
    bytesOut: PropTypes.array.isRequired,
    current: PropTypes.array.isRequired,
    available: PropTypes.array.isRequired
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  stopMonitor: PropTypes.func.isRequired
};

export default Dashboard;
