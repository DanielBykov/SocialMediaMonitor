import React, {Component} from "react"
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import {withGlobalState} from 'react-globally'
import moment from 'moment'
import vars from '../../../vars'
import {LoadingLine} from '../../loadingAnimation'
import {varsDiffAny, varDiff} from '../../tools'

export const apiDataToSeriesProcessing__LineChart = (data, globalState) => {
  let d = data
    .map(v => {
      const dateMom = moment(v.date)
      return {
        ...v,
        dateMom,
        dateChart: Date.parse(dateMom.toDate())
      }})
    .sort((a, b) => (
      a.dateMom.unix() - b.dateMom.unix()
    ))

  const {
    [vars.filter__lineChart]:filter__lineChart,
    [vars.filter__Period]:filter__Period,
    startDate,
    endDate
  } = globalState

  // Fill up missing dates
  const fillLoop = (dateLoop, days, rawData, addSymbol) => {
    let arr = []
    for(let i=0; i<days; i++){
      // console.log(': ',dateLoop.format('DD-MM-YYYY'))
      const xExist = rawData.find(x => (dateLoop.format('DD-MM-YYYY') === moment(x.date).format('DD-MM-YYYY') ))
      arr.push(xExist ? xExist : {
        dateChart: Date.parse(dateLoop.hour(12).minute(0).second(0).toDate()),
        dateMom: moment(dateLoop),
        mentions: 0,
        sentiment: 0,
        emo_anger: 0,
        emo_disgust: 0,
        emo_fear: 0,
        emo_joy: 0,
        emo_sadness: 0,
        number_articles: 0,
        zavy_score: 0,
        no_marker: 1
      })
      dateLoop.add(1, addSymbol)
    }
    return arr
  }

  const sDate = moment(startDate) < moment('2020-03-01') ? moment('2020-03-01') : moment(startDate)
  const eDate = moment(endDate)

  // Period Day - step 1 day
  if(filter__Period === vars.filter__Period__Day){
    const days = eDate.diff(sDate, 'd', false)

    if(days+1 > data.length){
      d = fillLoop(sDate, days+1, d, 'd')
    }
  }

  // Period Week - step 1 week
  else if(filter__Period === vars.filter__Period__Week){
    sDate.startOf('isoWeek')
    eDate.startOf('isoWeek')
    const days   = eDate.diff(sDate, 'd', false)
    const points = days/7+1

    if(points > data.length){
      d = fillLoop(sDate, points, d, 'w')
    }

  }

  // Period Month - step 1 month
  else if(filter__Period === vars.filter__Period__Month){
    sDate.startOf('months')
    eDate.startOf('months')
    const months   = eDate.diff(sDate, 'months', false)
    const points = months+1

    if(points > data.length){
      d = fillLoop(sDate, points, d, 'M')
    }
  }

  const series = [

    // Sentiment and Mentions Filter
    {
      name: 'Mentions',
      color: '#5573ff',
      type: 'area',
      yAxis: 1,
      chartFilter: vars.filter__lineChart__sentiment_mention,
      data: d.map(v => ({
        x: v.dateChart,
        y: v.mentions ? parseInt(v.mentions) : 0,
        marker: {enabled: v.no_marker === undefined},
        apiPointData: v,
      }))
    },
    {
      name: 'Sentiment',
      color: '#000',
      type: 'line',
      chartFilter: vars.filter__lineChart__sentiment_mention,
      data: d.map(v => ({
        x: v.dateChart,
        y: v.sentiment ? parseInt(v.sentiment*100) : 0,
        marker: {enabled: v.no_marker === undefined},
        apiPointData: v,
      }))
    },

    // Emotions Filter
    {
      name: 'Optimisim', // API: emo_joy
      color: '#ffbe50',
      type: 'line',
      yAxis: 0,
      chartFilter: vars.filter__lineChart__emotions,
      // data: d.map(v => ({x: v.dateChart, y: v.emo_joy ? Number((v.emo_joy*100).toFixed(2)) : 0, apiPointData: v}))
      data: d.map(v => ({x: v.dateChart, y: v.emo_joy ? parseInt(v.emo_joy*100) : 0, apiPointData: v}))
    },
    {
      name: 'Sadness', // API: emo_sadness
      color: '#74b4e8',
      type: 'line',
      chartFilter: vars.filter__lineChart__emotions,
      data: d.map(v => ({x: v.dateChart, y: v.emo_sadness ? parseInt(v.emo_sadness*100) : 0, apiPointData: v}))
    },
    {
      name: 'Fear', // API: emo_fear
      color: '#54d6b4',
      type: 'line',
      chartFilter: vars.filter__lineChart__emotions,
      data: d.map(v => ({x: v.dateChart, y: v.emo_fear ? parseInt(v.emo_fear*100) : 0, apiPointData: v}))
    },
    {
      name: 'Anger', // API: emo_anger
      color: '#ff7875',
      type: 'line',
      chartFilter: vars.filter__lineChart__emotions,
      data: d.map(v => ({x: v.dateChart, y: v.emo_anger ? parseInt(v.emo_anger*100) : 0, apiPointData: v}))
    },
    {
      name: 'Disgust', // API: emo_disgust
      color: '#d178d1',
      type: 'line',
      chartFilter: vars.filter__lineChart__emotions,
      data: d.map(v => ({x: v.dateChart, y: v.emo_disgust ? parseInt(v.emo_disgust*100) : 0, apiPointData: v}))
    },
  ]
  // console.log('se: ',series)
  return series
}

class LineChart extends Component {
  constructor(props) {
    super(props)
    this.chartObj = React.createRef()
  }
  get baseChartOptions(){
    return {
      chart:{
        style: {
          fontFamily: 'SofiaPro-Regular'
        },
        backgroundColor: null,
        // zoomType: 'x',
        alignTicks: false,
      },
      title: {text: null},
      credits: {enabled: false},
      xAxis: {
        type: 'datetime',
        labels: {
          format: '{value:%d %b}',
        },

        title: {
          text: null
        },
        style: {},
// black lives matter
      },
      yAxis: [
        {
          gridLineWidth: 0,
          title: {
            text: 'Sentiment',
            rotation: 90,
            margin: 20,
            style: {
              fontWeight:'bold',
              color: '#000000',
              fontSize: '14px',
            },
          },
          labels: {formatter: function () {
            if(this.value < -100 || this.value > 100) return null
            return Math.round(this.value) + '%'
          }},
          // max: 100,
          // softMax: 100,
          // min: -100,
          // softMin: -100,
          // endOnTick: false,

          plotLines: [{
            color: 'grey',
            dashStyle: 'dot',
            width: 1,
            value: 0
          }],
        },
        {
          gridLineWidth: 0,
          title: {
            text: 'Mentions',
            rotation: 90,
            margin: 20,
            style: {
              fontWeight:'bold',
              color: '#000000',
              fontSize: '14px',
            },
          },
          // labels: {formatter: function () {
          //     return Math.round(this.value)
          //   }},
          opposite: true
        },
      ],
      tooltip: {
        // xDateFormat: vars.dateFormat__ChartTooltip,
        shared: true,
      },
      plotOptions: {
        line: {
          tooltip: {
            valueSuffix: '%'
          }
        },
        series: {
          lineWidth: 5,
          cursor: 'pointer',
          marker: {
            radius: 5,
            // fillColor: '#000',
            lineWidth: 1,
            lineColor: null,
            symbol: 'circle',
          },
          // cursor: 'pointer',
          point: {
            events: {
              click: (e)=>{this.handlePointClick(e)},
            }
          }
        }
      },
      legend: {
        // layout: 'vertical',
        title: {
          text: 'KEY',
          style: {
            fontFamily: 'SofiaPro-SemiBold',
            fontSize: '12px',
            fontWeight: 'normal',
            letterSpacing: '1px',
            color: '#828282',
            transform: 'translate(-30px, 21px)'
          }
        },
        width: 210,
        align: 'right',
        x: -70,
        verticalAlign: 'top',
        // y: 100,
        // floating: true,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || // theme
          'rgba(255,255,255,0.25)'
      },
      series: [],

      exporting: {
        buttons: {
          contextButton: {
            enabled: false,
          }
        },
        // scale: 5,
        // width: 1024,
        sourceWidth: 1200,
        sourceHeight: 600,
        chartOptions: {
          chart: {
            style: {
              // fontFamily: 'SofiaPro-Regular',
              fontFamily: 'Arial',
              backgroundColor: `#fff`,
            }
          },
          legend :{
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
          },
        }
      },
    }
  }

  state = {
    options: this.baseChartOptions,
    pointClicked: false,
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // return true
    // Update Listeners
    return varsDiffAny([
      vars.lineChart,
      vars.filter__lineChart,
      vars.api__loading__pfx+vars.lineChart
    ], this.props.globalState, nextProps.globalState)
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    // const {series} = nextProps
    // set next State for chart updating
    nextState.options = { // (!) set options as new object, otherwise it's not updating
      // series: series,
    }
  }

  handlePointClick(e){
    const {point:{
      apiPointData,
      apiPointData:{no_marker},
      color,
      series:{name},
      y: mainValue
    }} = e

    this.props.setGlobalState({
      [vars.widget__lineChartData]: no_marker
        ? undefined
        : {...apiPointData, color, name, mainValue}
    })
  }

  render() {
    // Get Loading
    const {
      [vars.api__loading__pfx+vars.lineChart]:loading=false,
      [vars.lineChartSeries]:lineChartSeries=[],
      [vars.filter__lineChart]:filter__lineChart,
      startDate
    } = this.props.globalState

    let {options} = this.state

    options.series = lineChartSeries.filter(s=>s.chartFilter===filter__lineChart)

    return(
      <div className={'points-chart'}>
        {(loading && <LoadingLine/>)}
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={this.chartObj}
          // callback={(x)=>{this.chartObj = x}} // Set Highcharts object
          // constructorType={'stockChart'}
        />

      </div>
    )
  }
}

export default withGlobalState(LineChart)
