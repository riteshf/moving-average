import React from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';

class MainApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: { "currencyPair": "" },
      names: [],
      data: '',
      tickCount: 10,
      pipDiff: 15,
    }
    this.updateState = this.updateState.bind(this);
    this.setTickCount = this.setTickCount.bind(this);
    this.setPipDiff = this.setPipDiff.bind(this);
    this.initializeWS = this.initializeWS.bind(this);
    this.getCcyPair = this.getCcyPair.bind(this);
    this.calcMA = this.calcMA.bind(this);
  }

  updateState(e) {
    /*
     *  Set message.currencyPair to the selected option from the dropdown.
    */

  }

  setTickCount(e) {
    /*
     * Set tickCount here
     */
  }
  setPipDiff(e) {
    /*
     * Set pipDiff here
     */
  }

  initializeWS(messageValue) {
    /*
     * 1. Initialize the webSocket.
     * 2. Calculate moving average and display Moving average, Current Value and Buy/Sell (depending on the pipDiff)
     * 3. Return the webSocket.
     */
  }


  wsSend() {
    /*
     * Get the JSON messageValue from the selected currency pair in the dropdown and call initializeWS()
     */
  }

  getCcyPair() {
    /*
  	 * Use the REST API to get the list of currency pairs
  	 */
    let currentPairs = [];
    fetch('https://restsimulator.intuhire.com/currency_pairs')
      .then(response => {
        return response.json();
      }).then(data => {
        currentPairs = data.map(({ currency_name }) => {
          return currency_name
        });
        console.log(currentPairs);
        this.setState({
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
      <Container>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <h1><b>Moving Average</b></h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 3, offset: 4 }}>
            <h2>Choosing Currency Pair:</h2>
            <select>
              {this.state.names.map((pair) => <option key={pair}>{pair}</option>)}
            </select>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <h2>Number if Ticks</h2>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <h2>Pip Difference</h2>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default MainApp;
