import React from 'react';
import Home from './Home'
import {Route} from 'react-router-dom'
import Orders from './Orders';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Home} />
      <Route exact path="/orders" component={Orders} />
    </div>
  );
}

export default App;
