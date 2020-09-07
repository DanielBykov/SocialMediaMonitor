import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './react-datepicker.css'

import DatePicker from 'react-datepicker'
import moment from 'moment'

class DatePickerCustomInput extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string
  }
  inputClick = ()=>{

  }
  render() {
    const {value, onClick, onChange} = this.props;

    return (
      <div className="form-group">
        <input
          style={{cursor:'pointer'}}
          type="text"
          className="form-control"
          value={value}
          // placeholder={value}
          onClick={onClick}
          onChange={onChange}
          readOnly
        />
        <div className="date-picker-icon" onClick={onClick}/>
      </div>
    );
  }
}

export class DateRange extends Component{
  constructor(props){
    super(props)
    this.storage = window.sessionStorage
    const {rangeButtons=[]} = props
    // if(!props.startDate){
    //   this.props.startDate = moment().subtract(30-1,'days').toDate()
    // }
    if(rangeButtons.length){
      this.state.rangeButtons__li = rangeButtons
    }

  }
  state = {
    rangeButtons__li: [
      // {id:'3d', displayName:'3D', days:3, desc: 'Last 3 days'},
      {id:'1w', displayName:'1W', days:7, desc: 'Last 7 days'},
      {id:'1m', displayName:'1M', days:30, desc: 'Last 30 days'},
      {id:'3m', displayName:'3M', days:90, desc: 'Last 90 days'},
      {id:'1y', displayName:'1Y', days:365, desc: 'Last 365 days'},
    ],
    activeDateRangeButton: this.props.actBtn,
    screenSize: undefined
  }
  compareStartEndDates(startDate, endDate){
    let activeDateRangeButton = ''
    const
      startDateMom  = moment(startDate),
      endDateMom    = moment(endDate),

      isEndDate__Today = !(endDateMom.diff(moment(), 'days')),

      isStartDate__1dayFrom = (-1+1 === startDateMom.diff(moment(),'days')),
      isStartDate__7dayFrom = (-7+1 === startDateMom.diff(moment(),'days')),
      isStartDate__30dayFrom = (-30+1 === startDateMom.diff(moment(),'days'))

    if(isEndDate__Today){
      if(isStartDate__1dayFrom){
        activeDateRangeButton = '1d'
      } else if(isStartDate__7dayFrom){
        activeDateRangeButton = '1w'
      } else if(isStartDate__30dayFrom){
        activeDateRangeButton = '1m'
      }
    }
    return activeDateRangeButton
  }
  dayButton__Click = val => ()=>{
    const actBtn = val.id,
      startDate = moment().subtract(val.days-1, 'days').toDate(),
      endDate = moment().toDate()

    this.state.activeDateRangeButton = actBtn
    this.storage.zavyDateRangeActiveButton = actBtn
    this.storage.zavyDateRangeStartDate = startDate
    this.storage.zavyDateRangeEndDate = endDate
    this.props.upd({
      startDate: startDate,
      endDate: endDate,
    })
    const {fn=()=>{}} = val // fire the add function on the click
    fn()
  }
  datePicker_startDate__change = () =>(startDate)=>{
    this.state.activeDateRangeButton = this.compareStartEndDates(startDate, this.props.endDate)
    this.storage.zavyDateRangeActiveButton = this.state.activeDateRangeButton
    this.storage.zavyDateRangeStartDate = startDate
    this.props.upd({startDate: startDate})
  }
  datePicker_endDate__change =()=>(endDate)=>{
    this.state.activeDateRangeButton = this.compareStartEndDates(this.props.startDate, endDate)
    this.storage.zavyDateRangeActiveButton = this.state.activeDateRangeButton
    this.storage.zavyDateRangeEndDate = endDate
    this.props.upd({endDate: endDate})
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowDimensions)
    this.windowDimensions()
  }
  windowDimensions = ()=>{
    const w = window.innerWidth, sz = this.state.screenSize
    if(w < 768 && sz !== '320'){
      this.setState({screenSize:'320'})
    } else if(w >= 768 && sz !== '1024up'){
      this.setState({screenSize:'1024up'})
    }
  }


  render(){
    let {rangeButtons__li, activeDateRangeButton, } = this.state
    const {excludeBtn=[], loading} = this.props

    return (
      <>
        <div id="dateRange__fixedRange">
          <span className="box-header">Date</span>
          <ul className={"nav-list" + (loading ? ' loading-freeze' : '')}>
          {
            rangeButtons__li
              .filter( x=> !excludeBtn.includes(x.id) ) // Exclude some Buttons
              .map(x=> {
                const {id='-', displayName='-', desc='-'} = x
                return (
                  <li
                    key={id}
                    className="nav-item"
                    title={desc}
                  >
                <span
                  onClick={this.dayButton__Click(x)}
                  className={
                    "nav-link text" +
                    ((id===activeDateRangeButton) ? ' active' : '') }
                >
                  {displayName}
                </span>
                  </li>
                )
              })
          }
          </ul>
        </div>

        <div id="dateRange__datePicker">
          <div className="form-inline dp__wrap">

              {/*<label>*/}
            <div className={"dp-input-box from" + (loading ? ' loading-freeze' : '')}>
              <span className="box-header">From</span>

                <DatePicker
                  ref={(c) => this._calendar = c}

                  selected={this.props.startDate}

                  selectsStart
                  startDate={this.props.startDate}
                  endDate={this.props.endDate}

                  onChange={this.datePicker_startDate__change()}
                  dateFormat="dd / MM / yyyy"

                  minDate={this.props.minDate}
                  // maxDate={moment().toDate()}
                  maxDate={this.props.endDate}

                  withPortal={this.state.screenSize === '320'}

                  customInput={(<DatePickerCustomInput/>)}

                  // monthsShown={2}
                />
            </div>
              {/*</label>*/}

            <div className={"dp-input-box to" + (loading ? ' loading-freeze' : '')}>
              <span className="box-header">To</span>
              <DatePicker
                selected={this.props.endDate}

                selectsEnd
                startDate={this.props.startDate}
                endDate={this.props.endDate}

                onChange={this.datePicker_endDate__change()}
                dateFormat="dd / MM / yyyy"

                minDate={this.props.startDate}
                maxDate={moment().toDate()}

                withPortal={this.state.screenSize === '320'}

                customInput={(<DatePickerCustomInput/>)}

                // monthsShown={2}

                // popperPlacement={'bottom'}
                // popperPlacement={'bottom-end'}
                // popperPlacement={'bottom-start'}
                // popperPlacement={'auto'}

                // popperModifiers={{
                  // offset: {
                  //   enabled: true,
                  //   offset: '5px, 10px'
                  // },
                  // flip: {
                  //   enabled: false
                  // },
                  // preventOverflow: {
                  //   enabled: true,
                  //   escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                  //   boundariesElement: 'viewport'
                  // }
                //}}

              />
            </div>
          </div>
        </div>


      </>
    )
  }
}
