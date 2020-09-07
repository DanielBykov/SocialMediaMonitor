import React, {Component} from 'react'

const MediaItem = ({x, isActive, onClickFn}) => (
  <li
    className={"nav-item media__item"}
    onClick={onClickFn}
  >
    <i className={"nav-link media__ico " + x.id+"__ico" + ( isActive ? ' active' : '')}/>
  </li>
)

export class MediaMetricsLight extends Component{
  state = {
    metricState: {},
  }

  // Set Media & Metric in App
  media__Click = val => () => {
    const {mediaMetricsList, activeMedia, activeMetric} = this.props

    // First Metric ID
    let [ { metrics=[] }   ] = mediaMetricsList.filter(({id})=>id===val.id)
    let [ {id:firstMetricID}={} ] = metrics

    this.state.metricState[activeMedia] = activeMetric

    this.props.upd({
      activeMedia: val.id,
      activeMetric: this.state.metricState[val.id] || firstMetricID
    })
  }

  // Set Metric in App
  metric__Click = ({id}) => () => {
    // this.state.metricState[this.props.activeMedia] = val.id
    if(id === 'fb_content'){
      let {activeExtraMetrics} = this.props
      activeExtraMetrics.fb_postType = 'fb_branded'
      this.props.upd({activeExtraMetrics: activeExtraMetrics})
    }


      this.props.upd({activeMetric: id})
  }
  extraMetrics__Click = (item, extraMetricsStateID) => () => {
    // this.state.metricState[this.props.activeMedia] = val.id
    let {activeExtraMetrics} = this.props
    activeExtraMetrics[extraMetricsStateID] = item.id
    this.props.upd({activeExtraMetrics: activeExtraMetrics})
  }

  render() {
    const {
      mediaMetricsList=[],
      activeMedia='',
      activeMetric='',
      activeExtraMetrics={},
      showMetric = true,
      showMedia = true
    } = this.props

    if(!showMedia) return null

    const media__render = mediaMetricsList.map( x=> (
      <MediaItem
        key={x.id}
        x={x}
        isActive={(activeMedia===x.id)}
        onClickFn={this.media__Click(x)}
      />
    ) )

    const currentMetricsList = (mediaMetricsList.filter(x=> x.id===activeMedia )[0].metrics || [])
    // set first metric if activeMetric is ''
    let am = (activeMetric) ? activeMetric : ( (currentMetricsList[0] || '').id || '')

    const metric__render = currentMetricsList.map( x=> {
      return (
        <li
          key={x.id}
          className={"nav-item metric__item"}
          onClick={this.metric__Click(x)}
        >
          <span className={'nav-link text'+ ((x.id===am) ? ' active' : '')}>
            {x.displayName}
          </span>
        </li>
      )})

    const metricSelect__render = currentMetricsList.map( x=> {
      return (
        <option
          key={x.id}
          value={x.id}
          className={"nav-item"}
          // onClick={this.metric__Click(x)}
        >
          {x.displayName}
        </option>
      )})

    const extraMetricsFn = () => {
      const { extraMetrics:{isActive=false}={}, extraMetrics } = mediaMetricsList.filter( x => x.id===activeMedia)[0]
      if(isActive){
        return (
          <>
            <span className="box-header" style={{marginLeft:30}}>{extraMetrics.label}</span>
            <ul className="nav-list">
              {
                extraMetrics.items.map(it => (
                  <li key={it.id} className={"nav-item metric__item"} onClick={this.extraMetrics__Click(it, extraMetrics.id)}>
                    <span
                      className={'nav-link text'+ (activeExtraMetrics[extraMetrics.id]===it.id ? ' active' : '')}>
                      {it.label}
                    </span>
                  </li>
                ))
              }
            </ul>
          </>
        )
      }
      return null
    }

    return (
      <div id="mediaMetrics">

        <div className={'media__wrap'}>
          <div id="media">
            <span className="box-header">Channel</span>
            <ul className="nav-list">
              {media__render}
            </ul>
          </div>
        </div>

        {showMetric &&
        <div className={'metrics__wrap'}>

          <div id="metrics">
            <span className="box-header">Metric</span>
            <ul className="nav-list">
              {metric__render}
            </ul>

            { activeMetric!=='fb_content' && extraMetricsFn() }

          </div>

          <div id="metrics-select">
            <span className="box-header">Metric</span>
            <select
              value={am}
              className=""
              onChange={(x) => {
                this.props.upd({activeMetric: x.target.value})
              }}
            >
              {metricSelect__render}
            </select>
          </div>

        </div>
        }

      </div>
    )
  }
}

export class MediaMultiSelect extends Component{
  constructor(props){
    super(props)
  }

  // Set Media & Metric in App
  media__Click = mediaID => () => {
    const {
      activeMediaList=[],
    } = this.props

    if(activeMediaList.includes(mediaID)){
      activeMediaList.splice( activeMediaList.indexOf(mediaID), 1 )
    } else {
      activeMediaList.push(mediaID)
    }
    this.props.upd({
      activeMediaList: activeMediaList
    })

  }

  // Set Metric in App
  metric__Click = val => () => {
    // this.state.metricState[this.props.activeMedia] = val.id
    this.props.upd({activeMetric: val.id})
  }

  render() {
    const {
      activeMediaList=[],
      mediaMetricsList=[]
    } = this.props

    const media__render = mediaMetricsList.map( x=> {
      return (
        <MediaItem
          key={x.id}
          x={x}
          isActive={(activeMediaList.includes(x.id))}
          onClickFn={this.media__Click(x)}
        />

      )})

    return (
      <div id="mediaMetrics">
        <div id="media" className="navbar navbar-light bg-light z-gl__v-line">
          <span className="navbar-brand z-gl__box-header">Channel</span>
          <ul className="nav bg-light media__list">
            {media__render}
          </ul>
        </div>
        <div id="metrics" className="navbar navbar-light bg-light">
        </div>
      </div>
    )
  }
}
