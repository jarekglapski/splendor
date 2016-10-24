'use strict';

var { App } = require('./components/main');
global.socket = require('./game/socket').default();
require("../scss/main.scss");

ReactDOM.render(React.createElement(App), document.getElementById('root'));
