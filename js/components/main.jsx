'use strict';

import { IndexRoute, Router, Route, Link, browserHistory } from 'react-router';

function generateGameId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

const LoggedClient = ({ client }) => {
  var isCurrentUser = localStorage.getItem('_userId') == client;

  return (
    <li>
      {client} {isCurrentUser && <em>(you)</em>}
    </li>
  );
};

const GameScreen = React.createClass({
  displayName: 'GameScreen',

  getInitialState() {
    return {
      players: []
    };
  },

  componentWillMount() {
    var gameId = this.props.params.gameId;

    socket.emit('connect_to_room', gameId);
    socket.on('updated_room_players', this.updatePlayersList);

    socket.on('already_in_room', function(name) {
      window.alert(['already in the list', name])
    })

    window.onbeforeunload = function() {
      socket.emit('leave_room', gameId);
    }
  },

  componentWillUnmount() {
    var gameId = this.props.params.gameId;

    socket.emit('leave_room', gameId);
    socket.removeListener('updated_room_players', this.updatePlayersList);
  },

  updatePlayersList(clients, players) {
    this.setState({ clients, players });
  },

  render() {
    return (
      <div>
        <Link to="/">go Back</Link>
        <h1>Players in {this.props.params.gameId} room:</h1>
        <ul>
          {this.state.players.map((player, key) =>
            <li key={key}>{player}</li>
          )}
        </ul>
      </div>
    );
  }
});

const MainScreen = React.createClass({
  displayName: 'Application',

  getInitialState() {
    return {
      clients: []
    };
  },

  updateClients(clients) {
    this.setState({ clients });
  },

  componentDidMount() {
    socket.emit('get_clients');
    socket.on('clients_list_updated', this.updateClients);
  },

  componentWillUnmount() {
    socket.removeListener('clients_list_updated', this.updateClients);
  },

  startNewGame() {
    var gameId = generateGameId();

    socket.emit('start_new_game', gameId);
    browserHistory.push(`/game/${gameId}`);
  },

  render() {
    return (
      <div>
        <button onClick={this.startNewGame}>+ New Game</button> <Link to="/game/test">test room</Link>
        <h3>Players Online:</h3>
        <ul>
          {this.state.clients.map((client, key) =>
            <LoggedClient key={key} client={client}/>
          )}
        </ul>
      </div>
    );
  }
});

const NoMatch = () => {
  return (
    <h1>404 / nothing here</h1>
  );
}

const App = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/">
        <IndexRoute component={MainScreen}/>
      </Route>
      <Route path="/game/:gameId" component={GameScreen}/>
      <Route path="*" component={NoMatch}/>
    </Router>
  );
};

export { App };
