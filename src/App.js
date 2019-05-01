import React from 'react';
import './App.css';

import { Form, Col, Row, Button, Container, Card } from 'react-bootstrap';


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
      <div className="body">
        <Container>
          <Row>
            <Col >
              <Form>
                <Form.Label column style={{ textAlign: 'center' }}>
                  <h1>Moving Average</h1>
                </Form.Label>
                <Form.Group as={Row} >
                  <Form.Label column  >
                    Choosing Currency Pair:
                  </Form.Label>
                  <Col >
                  <Form.Control as="select" onChange={this.updateState}>
                      {this.state.names.map((pair) => <option key={pair}>{pair}</option>)}
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} >
                  <Form.Label column >
                    Number if Ticks:
            </ Form.Label>
                  <Col >
                    <Form.Control type="number" placeholder="number of ticks" value={this.state.tickCount} onChange={this.setTickCount} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} >
                  <Form.Label column >
                    Pip Difference:
            </ Form.Label>
                  <Col>
                    <Form.Control type="number" placeholder="pip difference" value={this.state.pipDiff} onChange={this.setPipDiff} />
                  </Col>
                </Form.Group>
                <Button variant="primary" onClick={this.wsSend}>Submit</Button>
              </Form>
              <Card>
                <Card.Body>
                  <table className="table table-borderless" style={{ background: 'white', color: 'black' }}>
                    <thead>
                      <tr>
                        <th  ><h3>Moving Average</h3></th>
                        <th  ><h3>Current Value</h3></th>
                        <th  ><h3>Buy/Sell</h3></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td  >{this.state.movingAverage !== 0 ? this.state.movingAverage : (
                          <h2>Please Wait...</h2>
                        )}</td>
                        <td  >{this.state.currentValue !== 0 && this.state.currentValue}</td>
                        <td style={{ color: this.state.option === 'BUY' ? 'green' : 'red' }}>{this.state.option}</td>
                      </tr>
                    </tbody>
                  </table>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div >
    )
  }
}

export default MainApp;
