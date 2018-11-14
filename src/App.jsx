import React, {Component, Fragment}     from 'react'
import {BrowserRouter as Router, Route} from "react-router-dom"
import Table                            from './Table.jsx'
import Papa                             from 'papaparse'
import '/styles.scss'

const cityData = require('/city-data.csv')

export default class App extends Component {

  constructor() {
    super()
    this.state = {data: []}
  }

  componentDidMount() {
    Papa.parse(cityData, {
      header: true,
      dynamicTyping: true,
      download: true,
      complete: ({data}) => this.setState({data})
    })
  }

  render() {

    const renderTable = props => <Table {...props} rows={this.state.data} />

    return (
      <Router>
        <Fragment>
          <Route exact path="/" render={renderTable} />
          <Route path="/:column" render={renderTable} />
        </Fragment>
      </Router>
    )
  }
}
