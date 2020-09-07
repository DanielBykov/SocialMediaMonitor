import React from 'react'
import { withGlobalState } from 'react-globally'
import vars from '../../../vars'

export const StatsWidget = withGlobalState((props) => {
  const {
    [vars.lineChart]:lineChart=[],
    [vars.widget__lineChartData]: data,
  } = props.globalState

  if(data) return null

  var totalStat;
  var netSentiment = 0;
  var showData = false;

  if(lineChart.length > 0){
    totalStat = lineChart.reduce((prev, curr) => {
      return{
        totalArticles: prev.totalArticles + Number(curr.number_articles),
        totalMentions: prev.totalMentions + Number(curr.mentions),
        totalSentiment: prev.totalSentiment + Number(Number(curr.sentiment * 100).toFixed(0))
      } 
    }, {totalArticles: 0, totalMentions: 0, totalSentiment: 0});
    netSentiment = totalStat.totalSentiment/lineChart.length
    showData = true;
  }

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
      showData ? (
        <div className={'stats-widget'}>
          <div className={'item'}>
            <div className={'title'}>Article & Posts</div>
            <div className={'value'}>{formatNumber(totalStat.totalArticles)}</div>
          </div>
          <div className={'item'}>
            <div className={'title'}>Total Mentions</div>
            <div className={'value'}>{formatNumber(totalStat.totalMentions)}</div>
          </div>
          <div className={'item'}>
            <div className={'title'}>Net Sentiment</div>
            <div className={'value'}>{Number(netSentiment.toFixed(0))}%</div>
          </div>
        </div>
    ): <div/>
  )
})
