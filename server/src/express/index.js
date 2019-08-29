const app = require('../servers').app;
const routes = require('./routes');

app.use('/api', routes);

module.exports = app;
