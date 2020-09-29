import React, {Component} from "react"
import {NavBar} from './components/NavBar/NavBar'
import {DateRange} from './components/DateRange/DateRange'
import {RadioFilter} from './components/FiltersBar/RadioFilter'
import {FiltersBarWrap} from './components/FiltersBar/FiltersBarWrap'
import Search from './components/SearchBar/Search'
import {ChartSectionWrap} from './components/MainBody/ChartsSection/ChartSectionWrap'
import {MainBodyWrap} from './components/MainBody/MainBodyWrap'
import {Sidebar} from './components/MainBody/Sidebar/Sidebar'
import LineChart from './components/MainBody/ChartsSection/LineChart'
import BubbleChart from './components/MainBody/ChartsSection/bubbleChart'
import {ChartFilterBar, ContentFilterBar} from './components/MainBody/ChartsSection/ChartFilterBar'
import TopContent from './components/MainBody/Sidebar/TopContent'
import {WidgetBox} from './components/MainBody/ChartsSection/Widgets/WidgetBox'
import {StatsWidget} from './components/MainBody/ChartsSection/Widgets/StatsWidget'
import {OnePointWidget__Bubble, OnePointWidget__Line} from './components/MainBody/ChartsSection/Widgets/OnePointWidget'

import { Provider, withGlobalState } from 'react-globally'
import {AllIco, BlogsIco, FbIco, NewsIco} from './style/Icons'
import vars from './vars'
import iniState from './iniState'
import {getBubbleChartApiData, getLineChartApiData, getTopContentData} from './zavyApi'

const DateRangeGS = withGlobalState((props) => {
  return (
    <DateRange
      {...props}
      startDate={props.globalState.startDate}
      endDate={props.globalState.endDate}
      actBtn={'3m'}
      upd={date => {
        props.setGlobalState(
          {
            ...date,
            [vars.widget__lineChartData]: undefined,
            [vars.widget__bubbleChartData]: undefined
          }
        )
      }}
    />
  )
})


class AppMonitor extends Component {

  render() {
    return(
      <>

        <NavBar/>

        <FiltersBarWrap>

          <RadioFilter
            id={vars.filter__Media}
            title={'CHANNEL'}
            list={[
              {label: 'All',  val: vars.filter__Media__total,     img: <AllIco/>    },
              {label: 'News', val: vars.filter__Media__news,      img: <NewsIco/>   },
              {label: 'Blog', val: vars.filter__Media__blog,      img: <BlogsIco/>  },
              {label: 'FB',   val: vars.filter__Media__facebook,  img: <FbIco/>     },
            ]}
            defValue={iniState[vars.filter__Media]}
          />

          <RadioFilter
            id={vars.filter__Country}
            title={'COUNTRY'}
            list={[
              {label: 'All', val: vars.filter__Country__ALL},
              {label: 'NZ', val: vars.filter__Country__NZ},
              {label: 'AU', val: vars.filter__Country__AU},
            ]}
            defValue={iniState[vars.filter__Country]}
          />

          <DateRangeGS/>

          <RadioFilter
            id={vars.filter__Period}
            title={'PERIODICITY'}
            list={[
              {label: 'D', val: vars.filter__Period__Day},
              {label: 'W', val: vars.filter__Period__Week},
              {label: 'M', val: vars.filter__Period__Month},
            ]}
            defValue={iniState[vars.filter__Period]}
          />
        </FiltersBarWrap>

        <Search/>

        <MainBodyWrap>

          <ChartSectionWrap>

            <div className={'key-metrics'}>

              <ChartFilterBar title={'Key Metrics Over Time'}>
                <RadioFilter
                  id={vars.filter__lineChart}
                  title={'TYPE'}
                  list={[
                    {label: 'Sentiment and Mentions', val: vars.filter__lineChart__sentiment_mention},
                    {label: 'Emotions',               val: vars.filter__lineChart__emotions}
                  ]}
                  defValue={iniState[vars.filter__lineChart]}
                />
              </ChartFilterBar>

              <LineChart/>

              <WidgetBox>
                <StatsWidget/>
                <OnePointWidget__Line/>
              </WidgetBox>
            </div>

            <div className={'top-content'}>

              {/*<ChartFilterBar title={'Top Topics'}>*/}
              {/*  <RadioFilter*/}
              {/*    id={vars.filter__bubbleChart}*/}
              {/*    title={'TYPE'}*/}
              {/*    list={[*/}
              {/*      {label: 'Category', val: vars.filter__bubbleChart__category},*/}
              {/*      {label: 'Emotions', val: vars.filter__bubbleChart__emotions}*/}
              {/*    ]}*/}
              {/*    defValue={iniState[vars.filter__bubbleChart]}*/}
              {/*  />*/}
              {/*</ChartFilterBar>*/}

              {/*<BubbleChart/>*/}

              {/*<WidgetBox>*/}
              {/*  <OnePointWidget__Bubble/>*/}
              {/*</WidgetBox>*/}

            </div>

          </ChartSectionWrap>

          <Sidebar>
            <ContentFilterBar title={'Top Content'}>
              <RadioFilter
                id={vars.filter__topContent}
                title={'TYPE'}
                  list={[
                    {label: 'Top',    val: vars.filter__topContent__top},
                    {label: 'Recent', val: vars.filter__topContent__recent}
                  ]}
                defValue={iniState[vars.filter__topContent]}
              />
            </ContentFilterBar>

            <TopContent/>

          </Sidebar>

        </MainBodyWrap>


      </>
    )
  }

  apiAllRequest(){

    getBubbleChartApiData(this.props)
    getLineChartApiData(this.props)
    getTopContentData(this.props)
  }

  componentDidMount() {
    this.apiAllRequest()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const stateNamesListen = [
      vars.filter__Country,
      vars.filter__Media,
      vars.filter__topContent,
      vars.filter__SearchString,
      vars.filter__SearchTags,
      vars.filter__Period,
      'startDate',
      'endDate',
    ]
    if(stateNamesListen.some(stateName=>{
      return prevProps.globalState[stateName] !== this.props.globalState[stateName]
    })){
      this.apiAllRequest()
    }
  }
}

const App_6_MonitorWith = withGlobalState(AppMonitor)

const App_6_MonitorGS = () => {
  return (
    <Provider globalState={iniState}>
      <App_6_MonitorWith/>
    </Provider>
  )
}

export default App_6_MonitorGS
