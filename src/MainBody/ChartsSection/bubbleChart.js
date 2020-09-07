import React, {Component} from "react"
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import vars from '../../vars'
import {LoadingLine} from '../../components/loadingAnimation'
import {withGlobalState} from 'react-globally'
import {varsDiffAny} from '../../components/tools'


class BubbleChart extends Component {
  constructor(props) {
    super(props)
    this.chartObj = React.createRef()
  }
  get baseChartOptions(){
    return {
      chart:{
        type: 'bubble',
        style: {
          fontFamily: 'SofiaPro-Regular'
        },
        backgroundColor: null,
      },
      title: {text: null},
      credits: {enabled: false},
      xAxis: {
        // type: 'datetime',
        // labels: {
        //   format: '{value:%d %b}',
        // },
        title: {
          text: 'Sentiment',
          style: {
            fontWeight:'bold',
            color: '#000000',
            fontSize: '14px',
          },
        },
        labels: {formatter: function () {
            // return Math.round(this.value*100) + '%'
            return Math.round(this.value*100*100)/100 + '%'
          }},
        plotLines: [{
          color: 'grey',
          dashStyle: 'dot',
          width: 1,
          value: 0
        }],
      },
      yAxis: {
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
        plotLines: [{
          color: 'grey',
          dashStyle: 'dot',
          width: 1,
          value: 0
        }],
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {

        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
              textTransform: 'capitalize',
              color: '#000',
              textOutline: false
            }
          },
          // lineWidth: 5,
          // cursor: 'pointer',
          point: {
            events: {
              click: (e)=>{this.handlePointClick(e)},
            }
          }
        }
      },
      legend: {
        layout: 'vertical',
        title: {
          text: 'KEY',
          style: {
            fontFamily: 'SofiaPro-SemiBold',
            fontSize: '12px',
            fontWeight: 'normal',
            letterSpacing: '1px',
            // color: '#828282',
            // transform: 'translate(-30px, 21px)'
          }
        },
        // width: 210,
        align: 'right',
        x: 0,
        verticalAlign: 'top',
        // y: 100,
        floating: true,
        // backgroundColor:
        //   Highcharts.defaultOptions.legend.backgroundColor || // theme
        //   'rgba(255,255,255,0.25)'
      },

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
      // series: [
      //   {
      //     name: 'General',
      //     color: '#91d98a',
      //     data: [
      //       {name: 'Lockdown', x: 10, y:50, z: 12},
      //       {name: 'Lockdown 2', x: 18, y:40, z: 22},
      //     ]
      //   },
      //   {
      //     name: 'People',
      //     color: '#8ab4d9',
      //     data: [
      //       {name: 'Tramp', x: 11, y:5, z: 2},
      //       {name: 'Jacinda', x: 8, y:30, z: 32},
      //     ]
      //   },
      //
      // ],
    }
  }

  state = {
    options: this.baseChartOptions,
    pointClicked: false
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // return true
    // Update Listeners
    return varsDiffAny([
      vars.bubbleChart,
      vars.filter__bubbleChart,
      vars.api__loading__pfx+vars.lineChart
    ], this.props.globalState, nextProps.globalState)
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const {series} = nextProps
    // set next State for chart updating
    nextState.options = { // (!) set options as new object, otherwise it's not updating
      series: series,
    }
  }

  handlePointClick(e){
    // console.log('Bubble Click: ',e.point.apiPointData)
    const {point:{apiPointData}} = e

    this.props.setGlobalState({
      [vars.widget__bubbleChartData]: apiPointData,
    })

  }

  get apiDataToSeries__BubbleChart(){
    const {
      [vars.bubbleChart]:bubbleChart=[],
      [vars.filter__bubbleChart]:filter__bubbleChart
    } = this.props.globalState

    switch (filter__bubbleChart) {

      // CATEGORY
      case vars.filter__bubbleChart__category:
        return [
          {id: 'topic',                   label: 'General', color: '#ffbe50'},
          {id: 'entities_persons',        label: 'People', color: '#ff7875'},
          {id: 'entities_organizations',  label: 'Organisations', color: '#54d6b4'},
          {id: 'entities_locations',      label: 'Places', color: '#74b4e8'},
        ].map(ser => {
        return {
          name: ser.label,
          color: ser.color,
          data: bubbleChart
            .filter(v => (v.type === ser.id))
            .map(v => {
              const {value = '-', mentions = '0', sentiment_score = 0.0, articles='0'} = v
              return {
                name: value,
                x: parseFloat(sentiment_score),
                y: parseInt(mentions),
                z: parseInt(articles ),
                apiPointData: {color: ser.color, ...v}
              }
            })
        }
      })

      // EMOTIONS
      case vars.filter__bubbleChart__emotions:
        return [
          {id: 'optimism',  label: 'Optimism',  color: '#ffbe50'},
          {id: 'sadness',   label: 'Sadness',   color: '#74b4e8'},
          {id: 'anger',     label: 'Anger',     color: '#ff7875'},
          {id: 'fear',      label: 'Fear',      color: '#54d6b4'},
          {id: 'disgust',   label: 'Disgust',   color: '#d178d1'},
        ].map(ser => {
        return {
          name: ser.label,
          color: ser.color,
          data: bubbleChart
            .filter(v => (v.max_emotion === ser.label))
            .map(v => {
              const {value = '-', mentions = '0', sentiment_score = 0.0, articles='0'} = v
              return {
                name: value,
                x: parseFloat(sentiment_score),
                y: parseInt(mentions),
                z: parseInt(articles),
                apiPointData: {color: ser.color, ...v}
              }
            })
        }
      })

    }

  }

  render() {
    const {[vars.api__loading__pfx+vars.bubbleChart]:loading=false} = this.props.globalState

    const {options} = this.state

    options.series = this.apiDataToSeries__BubbleChart

    return(
      <div className={'top-topic-chart'}>
        {(loading && <LoadingLine/>)}
        <HighchartsReact
          highcharts={Highcharts}
          // constructorType={'stockChart'}
          options={options}
          // callback={(x)=>{this.chartObj = x}} // Set Highcharts object
          ref={this.chartObj}
        />

      </div>
    )
  }

}

export default withGlobalState(BubbleChart)
