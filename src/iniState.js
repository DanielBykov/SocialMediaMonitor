import vars from './vars'
import moment from 'moment'

const iniState = {

  // filters
  [vars.filter__Media]  : vars.filter__Media__total,
  [vars.filter__Country]: vars.filter__Country__ALL,

  // [vars.filter__Period] : vars.filter__Period__Day,
  [vars.filter__Period]: vars.filter__Period__Week,
  // [vars.filter__Period]: vars.filter__Period__Month,

  [vars.filter__SearchString]: '',
  // [vars.filter__SearchTags]: "\"Bigpipe\"",
  [vars.filter__SearchTags]: '',

  [vars.filter__lineChart]  : vars.filter__lineChart__sentiment_mention,
  [vars.filter__bubbleChart]: vars.filter__bubbleChart__category,
  [vars.filter__topContent] : vars.filter__topContent__top,


  startDate: moment().subtract(90,'days').toDate(),
  // startDate : moment().subtract(30,'days').toDate(),
  endDate   : moment().toDate(),
}
export default iniState
