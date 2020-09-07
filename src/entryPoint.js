import React, {Component} from "react"
import ReactDOM from 'react-dom'

import App_6_MonitorSG from './AppMonitor'

import './style/sass/main.sass'


// Catch Errors Class
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Send an error to Sentry Scope
  }


  // MSIE used to detect old browsers and Trident used to newer ones
  isIE() {
    const ua = navigator.userAgent;
    return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  }

  render() {



    if (this.state.hasError) {
      return (
        <div>

          <h4 style={{textAlign:'center'}}>Something went wrong. Try reload the page</h4>

          {
            this.isIE() && <h4 style={{textAlign:'center'}}>Internet Explorer browser is not supported</h4>
          }

        </div>
      )

    }

    return this.props.children;
  }
}


const AppWrap = (
    <ErrorBoundary>
      <App_6_MonitorSG />
    </ErrorBoundary>
)

ReactDOM.render(AppWrap, document.getElementById('reactAppV5'));
