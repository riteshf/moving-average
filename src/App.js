import React from 'react';

class MainApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: {"currencyPair":""},
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
  }	
	
  calcMA() {
		/*
		 * Call wsSend()
		 */
  }
  
  render() {
    return (
      <div>
        <h1>Moving Average</h1>
      </div>
    )
  }
}

export default MainApp;
