import React, {PureComponent} from 'react'
import {RadioGroup, Radio} from 'react-radio-group'

import { withGlobalState } from 'react-globally'
import vars from '../../vars'

class RadioFilterCls extends PureComponent{
  state = {
    selectedValue: ''
  }
  handleChange = () => (x) => {

    this.setState({selectedValue: x})

    this.props.setGlobalState({
      [this.props.id]: x,
      [vars.widget__lineChartData]: undefined,
      [vars.widget__bubbleChartData]: undefined
    })
  }

  render() {
    const {id, title, list} = this.props
    return (
      <div className="radio-filter">
        <span className="box-header">{title}</span>

        <RadioGroup
          name={id}
          selectedValue={this.state.selectedValue}
          onChange={this.handleChange()}
          className={'filter-group'}
        >
          {
            list.map(x=>{
              let t = (typeof x === 'string')
                ? {label:x, val:x, img:undefined}
                : x
              let {label, val, img} = t
              return (
                <label className={'filter-item'} key={val}>
                  <Radio value={val} />
                  {
                    (img)
                      ? <div className={'ico'} title={label}>{img}</div>
                      : <span className={'text'}>{label}</span>
                  }
                </label>
              )})
          }
        </RadioGroup>

      </div>
    )
  }

  componentDidMount() {
    this.setState({selectedValue: this.props.defValue})
  }
}

export const RadioFilter = withGlobalState(RadioFilterCls)
