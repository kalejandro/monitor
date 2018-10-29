const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/monitor', { target: 'http://localhost:8080' }));
  app.use(proxy('/wsocket', { target: 'ws://localhost:8080', ws:true }));
};
