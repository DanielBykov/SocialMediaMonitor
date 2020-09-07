import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'

const zavyColorStyles = {
  colorPrimary: {
    backgroundColor: '#aaa',
  },
  barColorPrimary: {
    backgroundColor: '#000',
  },
}

// LINE
// Custom component base on the LinearProgress
const Line = withStyles(zavyColorStyles)(LinearProgress);

// Output the component
export function LoadingLine({className=''}) {
  return (
    <div className={className}>
      <Line />
    </div>
  );
}

// CIRCULAR
// Custom component base on the CircularProgress
const Circular = withStyles({
  root: {
    color: '#000',
  },
})(CircularProgress);
// const Circular = withStyles(zavyColorStyles)(CircularProgress)

// Output the component
export function LoadingCircular(props) {
  return (
    <div className={'circular-loading'}>
      <Circular />
    </div>
  );
}

