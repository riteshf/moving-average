import React from 'react';
import './App.css';

class MainApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: { "currencyPair": "" },
      names: [],
      data: '',
      tickCount: 10,
      pipDiff: 15,
      movingAverage: 0,
      currentValue: 0,
      option: '',
    }
    this.updateState = this.updateState.bind(this);
    this.setTickCount = this.setTickCount.bind(this);
    this.setPipDiff = this.setPipDiff.bind(this);
    this.initializeWS = this.initializeWS.bind(this);
    this.getCcyPair = this.getCcyPair.bind(this);
    this.wsSend = this.wsSend.bind(this);
    this.calcMA = this.calcMA.bind(this);
  }

  updateState(e) {
    var message = { ...this.state.message }
    message.currencyPair = e.target.value;
    this.setState({ message })
  }

  setTickCount(e) {
    this.setState({ tickCount: e.target.value });
  }

  setPipDiff(e) {
    this.setState({ pipDiff: e.target.value });
  }

  initializeWS(messageValue) {
    /*
     * 1. Initialize the webSocket.
     * 2. Calculate moving average and display Moving average, Current Value and Buy/Sell (depending on the pipDiff)
     * 3. Return the webSocket.
     */
    let Socket = new WebSocket('wss://stocksimulator.intuhire.com');
    let bindThis = this;
    Socket.onopen = function (evt) {
      Socket.send(JSON.stringify(messageValue));
      let data = [];
      Socket.onmessage = function (event) {
        let currentValue = parseFloat(event.data).toFixed(4);
        data.push(currentValue);
        if (data.length > bindThis.state.tickCount) {
          let option = '';
          data.slice(1, bindThis.state.tickCount);
          let movingAverage = parseFloat(data.reduce((acc, curr) => acc + curr)).toFixed(4);
          let diff = Math.round(Math.abs((movingAverage - currentValue) * 10000));
          if (currentValue < movingAverage && diff <= bindThis.state.pipDiff) {
            option = 'BUY';
          } else if (currentValue > movingAverage && diff >= bindThis.state.pipDiff) {
            option = 'SELL';
          }
          bindThis.setState({ currentValue, movingAverage, option });
        }
      }
    };

    // Socket.close();
  }


  wsSend() {
    console.log('was called');
    this.initializeWS(this.state.message);
  }

  getCcyPair() {
    let currentPairs = [];
    fetch('https://restsimulator.intuhire.com/currency_pairs')
      .then(response => response.json())
      .then(data => {
        currentPairs = data.map(({ currency_name }) => currency_name);
        var message = { ...this.state.message }
        message.currencyPair = currentPairs[0];
        this.setState({
          message,
          names: currentPairs,
        });
      });
    return currentPairs;
  }

  calcMA() {
    /*
     * Call wsSend()
     */
  }

  componentDidMount() {
    this.getCcyPair();
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            <h1><b>Moving Average</b></h1>
          </label>
          <label>
            <h2>Choosing Currency Pair:</h2>
            <select onChange={this.updateState}>
              {this.state.names.map((pair) => <option key={pair}>{pair}</option>)}
            </select>
          </label>
          <label>
            <h2>Number if Ticks: </h2>
            <input type="number" value={this.state.tickCount} onChange={this.setTickCount}></input>
          </label>
          <label>
            <h2>Pip Difference: </h2>
            <input type="number" value={this.state.pipDiff} onChange={this.setPipDiff}></input>
          </label>
          <input type="button" value="Submit" onClick={this.wsSend} />
        </form>
        <br />
        <br />
        <div className="row" style={{ paddingLeft: '10%', textAlign: 'center' }} >
          <table style={{ background: 'white', color: 'black' }}>
            <thead>
              <tr>
                <th width="20%" ><h3>Moving Average</h3></th>
                <th width="20%" ><h3>Current Value</h3></th>
                <th width="15%" ><h3>Buy/Sell</h3></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="20%" >{this.state.movingAverage !== 0 ? this.state.movingAverage : (
                  <h2>Please Wait...</h2>
                )}</td>
                <td width="20%" >{this.state.currentValue !== 0 && this.state.currentValue}</td>
                <td width="15%" style={{ color: this.state.option === 'BUY' ? 'green' : 'red' }}>{this.state.option}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default MainApp;
