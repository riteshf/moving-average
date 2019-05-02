import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import MainApp from './App';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Router>
        <MainApp />
    </Router>
    , document.getElementById('MainApp'));
registerServiceWorker();
