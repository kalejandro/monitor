import RequestError from './errors/RequestError';

export const make = data => {
  if (data.before) {
    data.before();
  }

  let init = {
    method: data.method,
    headers: {
      'Content-type': 'Application/json'
    },
    credentials: 'same-origin'
  };

  if (data.method !== 'GET') {
    init['headers']['X-XSRF-TOKEN'] = data.token;
    init['body'] = JSON.stringify(data.body);
  }

  return fetch(data.url, init)
    .then(
      res => res.json().then(json => ({status: res.status, json }))
    )
    .then(({status, json}) => {
      if (status === 200) {
        return json;
      } else {
        return Promise.reject(new RequestError(status, json.message));
      }
    }, error => {
      return Promise.reject(Error('Unexpected error'));
    });
};
