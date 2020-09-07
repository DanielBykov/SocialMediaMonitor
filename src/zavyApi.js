import axios from 'axios'
import moment from 'moment'
import vars from './vars'
import {apiDataToSeriesProcessing__LineChart} from './MainBody/ChartsSection/LineChart'

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
  const url = '/api/v5/'
  //'/api/v5/?appName=zavy_monitor&searchTags=Mentions&dev_company_id=16'
  return axios.get(url, {
    params: {
      ...paramsAppName(),
      searchTags: value
    }
  })
    .then(result=>{
      const {data: {appData:{tags=[], my_tags=[]}}} = result
      return {tags, my_tags}
    })
}

export const getBubbleChartApiData = (props) => {
  const chartType = vars.bubbleChart
  const {globalState:gs, setGlobalState: setGS} = props

  // Local Demo Data
  // setGS({[chartType]: vars.bubbleDemoData})

  zavyAPIRequest({
    apiURL : vars.api__url + 'bubblechart/',
    apiParams: {
      ...paramsAllFilters(props),
    },
    callBack__Before: ()=>{
      setGS({[vars.api__loading__pfx+chartType]: true})
    },
    callBack__Success: (resp) => {
      setGS({[vars.api__loading__pfx+chartType]: false})
      setGS({[chartType]: resp.data})
      //props.setGlobalState({[chartType]: resp.data.appData.json})
      // callBack__Success()
    },
    callBack__Error: err => {
      setGS({[vars.api__loading__pfx+chartType]: false})
      console.error('ZAVY: ', err)
    }
  })

}

export const getLineChartApiData = (props) => {
  zavyAPIRequest({
    apiURL : vars.api__url + 'linechart/',
    apiParams: {
      ...paramsAllFilters(props),
      period: props.globalState[vars.filter__Period]
    },
    callBack__Before: ()=>{
      props.setGlobalState({[vars.api__loading__pfx+vars.lineChart]: true})
    },
    callBack__Success: ({data}) => {
      props.setGlobalState({
        [vars.api__loading__pfx+vars.lineChart]: false,
        [vars.lineChart]: data,
        [vars.lineChartSeries]: apiDataToSeriesProcessing__LineChart(data, props.globalState)
      })
    }
  })
}

export const getTopContentData = ({
  contentType, props, callBack__Before, callBack__Success
}) => {
  zavyAPIRequest({
    apiURL : vars.api__url + 'topcontent/',
    apiParams: {
      ...paramsContentDate(props.globalState),
      ...paramsContentFilters(props.globalState),
      contentType,
    },
    callBack__Before: ()=>{
      props.setGlobalState({[vars.api__loading__pfx+contentType]: true})
    },
    callBack__Success: (resp) => {
      props.setGlobalState({[vars.api__loading__pfx+contentType]: false})
      props.setGlobalState({[contentType]: resp.data})
      //props.setGlobalState({[contentType]: resp.data.appData.json})
      callBack__Success()
    }
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

export const zavyAPIRequest = (
  {
    apiURL = window.apiURL,
    apiParams = paramsAppNameDate(),
    callBack__Before = ()=>({}),
    callBack__Success = (resp)=>({}),
    callBack__ZavyError = (resp)=>({}),
    callBack__Error = (err)=>({}),
    getState,
    setState,
  }
) => {
  callBack__Before()

  // Request
  axios.get(apiURL, {
    params: apiParams
  })
    .then((resp) => {

      // Success Request
      // State
      callBack__Success(resp)
      // this.setGS(
      //   {
      //     ...newStateCallBack(resp),
      //     apiLastUrl: resp.request.responseURL,
      //     apiAttempt: 1,
      //     apiLoading: false
      //   }
      // )

      // Zavy Returns Errors
      // Send error messages to the console
      // const errors = (resp.data.errors || [])
      // if(errors.length){
      //   errors.forEach((e,i)=>{
      //     console.error(`Data error (#${i+1})`, e)
      //   })
      // }

    })

    // Bad Request to Zavy
    .catch((err) => {
      callBack__Error(err)

      // console.log('API-Error-Response: ', err.response)
      // const extraState = errorStateCallBack(err)
      // const status = err.response.status
      // const timeout = (new Date() - err.response.config.timeStartD256) / 1000
      //
      // this.setGS({
      //   flagApiError: true,
      //   apiErrorResponseData: {
      //     // flagLongApiRequest: (status===502 && timeout > 25),
      //     // flagLongApiRequest: status===500, // DEV
      //     status: err.response.status,
      //     timeout: (new Date() - err.response.config.timeStartD256) / 1000
      //   },
      //   apiLoading: false,
      //   ...extraState
      // })
    })
}
