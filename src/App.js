import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import MainContainer from './components/MainContainer'
import './App.css'

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  palette: {
      primary: {
        light: '#757ce8',
        main: '#757ce8',
        dark: '#002884',
        contrastText: '#444',
      },
      secondary: {
        main: '#3F51B5',
      },
    },
})

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      loading: false,
      userInfo: null
    }
  }

  render() {
    return (
      <div className="App">
          <MuiThemeProvider theme={theme}>
            <MainContainer />
          </MuiThemeProvider>
      </div>
    )
  }
}

export default App
