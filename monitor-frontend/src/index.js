import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';

import rootReducer from './reducers';
import logger from './middlewares/logger';
import stomp from './middlewares/stomp';
import App from './App';

const store = createStore(rootReducer, applyMiddleware(thunk, stomp, logger));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
