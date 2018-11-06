import chartColors from './chartColors';

// Chart datasets for op. counters
export const opCounters = (insert, query, update, delete_) => {
  return [{
    label: 'insert',
    data: insert,
    fill: true,
    backgroundColor: chartColors.RGBA.pink,
    borderColor: chartColors.RGB.pink
  },
  {
    label: 'query',
    data: query,
    fill: true,
    backgroundColor: chartColors.RGBA.yellow,
    borderColor: chartColors.RGB.yellow
  },
  {
    label: 'update',
    data: update,
    fill: true,
    backgroundColor: chartColors.RGBA.teal,
    borderColor: chartColors.RGB.teal
  },
  {
    label: 'delete',
    data: delete_,
    fill: true,
    backgroundColor: chartColors.RGBA.blue,
    borderColor: chartColors.RGB.blue
  }];
};

// Chart datasets for op. counters 2
export const opCounters2 = (getmore, command ) => {
  return [{
    label: 'getmore',
    data: getmore,
    fill: true,
    backgroundColor: chartColors.RGBA.grey,
    borderColor: chartColors.RGB.grey
  },
  {
    label: 'command',
    data: command,
    backgroundColor: chartColors.RGBA.violet,
    borderColor: chartColors.RGB.violet
  }];
};

// Chart datasets for network
export const network = (bytesIn, bytesOut) => {
  return [{
    label: 'bytesIn',
    data: bytesIn,
    backgroundColor: chartColors.RGBA.purple,
    borderColor: chartColors.RGB.purple
  },
  {
    label: 'bytesOut',
    data: bytesOut,
    backgroundColor: chartColors.RGBA.blue,
    borderColor: chartColors.RGB.blue
  }];
};

// Chart datasets for connections
export const connections = (current, available) => {
  return [{
    label: 'current',
    data: current,
    backgroundColor: chartColors.RGBA.pink,
    borderColor: chartColors.RGB.pink
  },
  {
    label: 'available',
    data: available,
    backgroundColor: chartColors.RGBA.teal,
    borderColor: chartColors.RGB.teal
  }];
};
