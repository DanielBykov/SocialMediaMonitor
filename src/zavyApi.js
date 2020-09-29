import axios from 'axios'
import moment from 'moment'
import vars from './vars'
import {apiDataToSeriesProcessing__LineChart} from './components/MainBody/ChartsSection/LineChart'

export const getTopContentForLineWidget = (props) => {
  let {data: {
    date,
    name:seriesName,
    sentiment
  }} = props

  let sort = '', order = 'desc'
  switch (seriesName) {
    case 'Sentiment':
      sort='sentiment_score*mentions'
      order = sentiment <=0 ? 'asc' : 'desc'
      break
    case 'Mentions' : sort='mentions'; break
    case 'Optimisim': sort='joy*sentiment_score*mentions'; break
    case 'Fear'     : sort='fear*mentions'; break
    case 'Sadness'  : sort='sadness*mentions'; break
    case 'Disgust'  : sort='disgust*mentions'; break
  }

  let startDate = moment(date)
  let endDate   = moment(date)

  // If Periodicity filter W or M => set endDate to end of week/month (issued by Ant 24-06-2020)
  switch (props.globalState[vars.filter__Period]) {
    case vars.filter__Period__Week:
      endDate.endOf('isoWeek')
      break
    case vars.filter__Period__Month:
      endDate.endOf('month')
      break
  }

  let params = {
    startDate : startDate.format(vars.dateFormat__apiQuery),
    endDate   : endDate.format(vars.dateFormat__apiQuery),
    ...paramsContentFilters(props.globalState),
    limit     : 5,
    sort      : sort,
    order     : order
  }

  return axios.get(vars.api__url_dev + 'topcontent/', {
    params: params
  })
}

export const getTopContentForBubbleWidget = (props) => {
  let {data: {value:searchString=''}} = props
  let params = {
    // startDate: '2020-03-22',
    // endDate: '2020-03-23',
    ...paramsContentDate(props.globalState),
    ...paramsContentFilters(props.globalState),
    searchString: searchString,
    limit: 5
  }

  return axios.get(vars.api__url + 'topcontent/', {
    params: params
  })
}

export const searchByZavyTags = (value) => {
  const url = 'local-data/tags.json'
  return axios.get(url, {
    params: {
      // ...paramsAppName(),
    }
  })
    .then(result => new Promise( resolve => setTimeout( ()=>resolve(result),750 ) ))
    .then(result => {
      let {data: {tags=[], my_tags=[]}} = result
      tags = tags.filter(el => {
        return el[1].indexOf(value) !== -1
      })
      return {tags, my_tags}
    })
}

export const getBubbleChartApiData = (props) => {
  const url = 'local-data/bubblechart.json'
  props.setGlobalState({[vars.api__loading__pfx+vars.bubbleChart]: true})
  axios.get(url, {
    params: {
      // ...paramsAppName(),
    }
  })
    .then(result => new Promise( resolve => setTimeout( ()=>resolve(result),750 ) ))
    .then(result => {
      console.log('res: ',result)
      props.setGlobalState({
        [vars.api__loading__pfx+vars.bubbleChart]: false,
        [vars.bubbleChart]: result.data.app_data,
      })
    })

}

export const getLineChartApiData = (props) => {
  const url = 'local-data/linechart.json'
  props.setGlobalState({[vars.api__loading__pfx+vars.lineChart]: true})
  axios.get(url, {
    params: {
      // ...paramsAppName(),
    }
  })
    .then(result => new Promise( resolve => setTimeout( ()=>resolve(result),750 ) ))
    .then(result => {
      console.log('res: ',result)
      props.setGlobalState({
        [vars.api__loading__pfx+vars.lineChart]: false,
        [vars.lineChart]: result.data.app_data,
        [vars.lineChartSeries]: apiDataToSeriesProcessing__LineChart(result.data.app_data, props.globalState)
      })
    })
}

export const getTopContentData = (props) => {
  const url = 'local-data/top-posts.json'
  props.setGlobalState({[vars.api__loading__pfx+vars.topContent]: true})
  axios.get(url, {
    params: {
      // ...paramsAppName(),
    }
  })
    .then(result => new Promise( resolve => setTimeout( ()=>resolve(result),750 ) ))
    .then(result => {
      props.setGlobalState({[vars.api__loading__pfx+vars.topContent]: false})
      props.setGlobalState({[vars.topContent]: result.data.app_data})
    })
}

const paramsAppNameDate = (getState) => {
  const {companyID=0, appName, devModeLocal=false} = window
  const res = {
    appName: vars.appNameZavyMonitor,
    startDate: moment(getState.startDate).format(vars.dateFormat__apiQuery),
    endDate: moment(getState.endDate).format(vars.dateFormat__apiQuery),
  }
  if(devModeLocal) res.dev_company_id = companyID
  return res
}

const paramsAppName = () => {
  const {companyID=0, appName, devModeLocal=false} = window
  const res = {
    appName: vars.appNameZavyMonitor,
  }
  if(devModeLocal) res.dev_company_id = companyID
  return res
}

const paramsContentDate = (getState) => {
  const {companyID=0, appName, devModeLocal=false} = window
  const res = {
    // appName: vars.appNameZavyMonitor,
    startDate: moment(getState.startDate).format(vars.dateFormat__apiQuery),
    endDate: moment(getState.endDate).format(vars.dateFormat__apiQuery),
  }
  // if(devModeLocal) res.dev_company_id = companyID
  return res
}

const paramsAllFilters = (props) => {
  const {globalState:gs} = props
  return {
    startDate: moment(gs.startDate).format(vars.dateFormat__apiQuery),
    endDate: moment(gs.endDate).format(vars.dateFormat__apiQuery),

    mediaType:    gs[vars.filter__Media],
    topicType:    '_all_',
    country:      gs[vars.filter__Country],
    searchString: gs[vars.filter__SearchString],
    searchTag:    gs[vars.filter__SearchTags]
  }
}

const paramsContentFilters = (getState) => {
  const {
    [vars.filter__Media]: media,
    [vars.filter__Country]: country,
    [vars.filter__SearchTags]: searchTags,
    [vars.filter__SearchString]: searchString,
    [vars.filter__topContent]: sort,
  } = getState
  return {
    mediaType: media,
    topicType: '_all_',
    country: country,
    searchString: searchString,
    searchTag: searchTags,
    sort: sort,
  }
}

