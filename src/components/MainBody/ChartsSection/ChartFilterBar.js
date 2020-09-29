import React from 'react'

export const ChartFilterBar = (props) => (
  <div className={'chart-filters-bar'}>
    <div className={'chart-title'}>{props.title}</div>
    {props.children}
  </div>
)

export const ContentFilterBar = (props) => (
  <div className={'content-top-bar'}>
    <div className={'content-title'}>{props.title}</div>
    {props.children}
  </div>
)