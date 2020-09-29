import React, {useEffect, useState} from 'react'
import {EmotionsBox} from './EmotionsBox'
import { withGlobalState } from 'react-globally'
import vars from '../../../../vars'
import {abbrNum} from '../../../tools'
import {TopContentWidget} from './TopContentWidget'
import {CloseCrossIco} from '../../../../style/Icons'
import {getTopContentForBubbleWidget, getTopContentForLineWidget} from '../../../../zavyApi'
import moment from 'moment'

export const OnePointWidget__Line = withGlobalState((props) => {

  const handleClose = () => {
    props.setGlobalState({[vars.widget__lineChartData]:undefined})
  }

  let {
    [vars.widget__lineChartData]: data={hide: true},
    [vars.filter__lineChart]: filter__lineChart,
  } = props.globalState

  useEffect(()=>{
    // Hide widget when Filter is changed (Category/Emotions)
    props.setGlobalState({[vars.widget__lineChartData]:undefined})
  },[filter__lineChart])

  let {
    hide=false,
    sentiment:sentiment_score=0.0,
    mentions='0',
    number_articles:articles='0',
    date='',
    currentLineNameD256='',
    color,
    name:lineName='',
    mainValue
  } = data

  // console.log('data: ',data)
  let emotionLineName = lineName.toLowerCase()

  let
    bg = color,
    darkTheme ='',

    v1_label  = '',
    v1_val    = '',
    v2_label  = 'Articles & Posts',
    v2_val    = abbrNum(parseInt(articles)),
    v3_label  = '',
    v3_val    = '',
    dateVal   = moment(date).format(vars.dateFormat__Widget)

  switch (lineName) {
    case 'Sentiment':
      darkTheme   = ' dark-theme'
      v1_label    = 'Sentiment'
      v1_val      = mainValue + '%'
      v3_label    = 'Total Mentions'
      v3_val      = abbrNum(parseInt(mentions))
      break
    case 'Mentions':
      v1_label    = 'Mentions'
      v1_val      = abbrNum(parseInt(mainValue))
      v3_label    = 'Sentiment'
      v3_val      = `${Number(parseFloat(sentiment_score) * 100).toFixed(1)}%`
      break
    default :
      v1_label    = 'Emotions'
      v1_val      =
        <div className={'line-widget-emo-box'}>
          <EmotionsBox
            limit={1}
            emotions={{[lineName.toLowerCase()]: mainValue/100}}
            maxIconSize={70}
            tooltipInside
          />
        </div>
      // v1_val      = mainValue + '%'
      v3_label    = 'Total Mentions'
      v3_val      = abbrNum(parseInt(mentions))
      break
  }

  // Small font-size for a long word
  let fontAdj = 100
  let maxWordLength = 5
  if(v1_label.length > maxWordLength) fontAdj =  maxWordLength / v1_label.length  * 100

  return (
    <div
      className={'one-point-widget ' + (hide ? ' hide':'') + darkTheme}
      style={{backgroundColor: bg}}>

      <div className={'sidebar'}>

        <div className={'wrap'}>
          <div className={'main-box'}>
            <div className={'title'}>
              {v1_label}
            </div>
            <div className={'value-box'}>
              <div className={'val-ico'}></div>
              <div className={'val-label'}></div>
              <div className={'val'}>{v1_val}</div>
            </div>
          </div>

          <div className={'sub-metrics-box'}>
            <div className={'item'}>
              <div className={'title'}>{v2_label}</div>
              <div className={'val'}>{v2_val}</div>
            </div>
            <div className={'item'}>
              <div className={'title'}>{v3_label}</div>
              <div className={'val'}>{v3_val}</div>
            </div>
          </div>
        </div>

        <div className={'date'}>
          <div className={'title'}>Date</div>
          <div className={'val'}>{dateVal}</div>
        </div>
      </div>

      <div className={'child'}>
        <TopContentWidget data={data} apiGetter={getTopContentForLineWidget}/>
      </div>


      <div className={'close-btn'} onClick={handleClose}>
        <CloseCrossIco/>
      </div>

    </div>
  )
})

export const OnePointWidget__Bubble = withGlobalState((props) => {

  const handleClose = () => {
    props.setGlobalState({[vars.widget__bubbleChartData]:undefined})
  }

  let {
    [vars.widget__bubbleChartData]: data={hide: true},
    [vars.filter__bubbleChart]: filter__bubbleChart,
  } = props.globalState

  // Hide widget when Filter is changed (Category/Emotions)
  useEffect(()=>{
    props.setGlobalState({[vars.widget__bubbleChartData]:undefined})
  },[filter__bubbleChart])

  // Mapping Data
  let {
    hide=false,
    value: title='0',
    mentions='0',
    articles='0',
    sentiment_score=0.0,
    color:bg='#aaa',

    // Emotions
    anger=0.0,
    disgust=0.0,
    fear=0.0,
    optimism=0.0,
    sadness=0.0,
  } = data

  let emotions = {
    anger,
    disgust,
    fear,
    optimism,
    sadness,
  }

  // Small font-size for a long word
  let fontAdj = 100
  let maxWordLength = 8
  if(title.length > maxWordLength) fontAdj =  maxWordLength / title.length  * 100

  return (
    <div
      className={'one-point-widget bubble-chart-view' + (hide ? ' hide':'')}
      style={{backgroundColor: bg}}>

      <div className={'sidebar'}>

        <div className={'wrap'}>
          <div className={'main-box'}>
            <div className={'title'}>Topic</div>
            <div className={'value-box'}>
              <div className={'val-ico'}></div>
              <div className={'val-label'}></div>
              <div className={'val'}>{
                // `${Number(data.sentiments * 100).toFixed(0)}%`
                <div style={{fontSize: fontAdj+'%'}}>{title}</div>
              }</div>
            </div>
          </div>

          <div className={'sub-metrics-box'}>
            <div className={'item'}>
              <div className={'title'}>Sentiment</div>
              <div className={'val'}>{Math.round(sentiment_score*10)/10}%</div>
            </div>
            <div className={'item'}>
              <div className={'title'}>Articles & Posts</div>
              <div className={'val'}>{abbrNum(parseInt(articles))}</div>
            </div>
            <div className={'item'}>
              <div className={'title'}>Total Mentions</div>
              <div className={'val'}>{abbrNum(parseInt(mentions))}</div>
            </div>
          </div>
        </div>

        {/*<div className={'date'}>*/}
        {/*  <div className={'title'}>Date</div>*/}
        {/*  <div className={'val'}>-</div>*/}
        {/*</div>*/}
      </div>

      <div className={'widget-sidebar-emotions-wrap'}>
        <EmotionsBox
          theme={'white'}
          emotions={emotions}
          tooltip
        />
      </div>

      <div className={'child'}>
        <TopContentWidget data={data} apiGetter={getTopContentForBubbleWidget}/>
      </div>


      <div className={'close-btn'} onClick={handleClose}>
        <CloseCrossIco/>
      </div>

    </div>
  )
})




