import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

export const MonitorInfo = (props) => {
  return (
    <Table basic>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Property</Table.HeaderCell>
          <Table.HeaderCell textAlign='right'>Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Connection String</Table.Cell>
          <Table.Cell textAlign='right'>{props.uri}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>serverSelectionTimeout (ms)</Table.Cell>
          <Table.Cell textAlign='right'>
            {props.serverSelectionTimeout}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>updateFrequency (ms)</Table.Cell>
          <Table.Cell textAlign='right'>{props.updateFrequency}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

MonitorInfo.propTypes = {
  uri: PropTypes.string.isRequired,
  serverSelectionTimeout: PropTypes.number.isRequired,
  updateFrequency: PropTypes.number.isRequired
};

export default MonitorInfo;
