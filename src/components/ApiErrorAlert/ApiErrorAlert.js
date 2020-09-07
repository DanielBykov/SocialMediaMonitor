import React, {Component} from 'react'
import './s.sass'

export default class ApiErrorAlert extends Component{
  render() {
    const {
      open,
      upd,
      apiErrorResponseData: {
        status=0,
        timeout=0,
        flagLongApiRequest=false
      }
    } = this.props

    let text = ''
    if(flagLongApiRequest){
      text = 'API Error! Long request. Try to reduce the date range' // not using
    } else {
      text = 'API Error! Try again later'
    }

    return (
      <div
        id={'alert-popup'}
        className={(open)?'opened':''}
        onClick={()=>upd({flagApiError:false})}
        title={'Click to close'}
      >
        <div className={'alert-popup__wrap'}>
          {text}
        </div>
        <div
          className={'close'}
          >x</div>
      </div>
    )
  }
}
