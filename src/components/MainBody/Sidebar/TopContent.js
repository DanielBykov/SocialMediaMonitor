import React, {Component} from 'react'
import moment from 'moment'
import {withGlobalState} from 'react-globally'
import {CommentsIcon, EmoIcons, LikeIcon, SharesIcon} from '../../../style/Icons.js'
import vars from '../../../vars'
import {LoadingLine} from '../../loadingAnimation'
import {EmotionsBox} from '../ChartsSection/Widgets/EmotionsBox'

class TopContent extends Component {
  constructor(props) {
    super(props)
    this.vertScrollRef = React.createRef()
    this.horiScrollRef = React.createRef()
  }

  state = {
    topics: []
  }

  get apiTopicContent(){
    let {
      [vars.topContent]: contents=[]
    } = this.props.globalState

    // Remove duplicates by key=mm_id
    contents = [...new Map(contents.map(item => [item.mm_id, item])).values()]

    return contents
      .map(v => ({
        ...v,
        dateHmn: moment.unix(v.date).format('ddd, DD MMM, YYYY'),
        emo: this.findTopThree({
          joy: Math.round(v.optimism * 100),
          fear: Math.round(v.fear * 100),
          anger: Math.round(v.anger * 100),
          sadness: Math.round(v.sadness * 100),
          disgust: Math.round(v.disgust * 100)
        })
      }));
  }

  findTopThree = (obj) => {
    var props = Object.keys(obj).map(function(key) {
      return { key: key, value: this[key] };
    }, obj);
    props.sort(function(p1, p2) { return p2.value - p1.value; });
    var topThree = props.slice(0, 3);

    return topThree;
  }

  render() {
    const {[vars.api__loading__pfx+vars.topContent]:loading=false} = this.props.globalState

    const posts = this.apiTopicContent

    return(
      <div className={'top-content-list'}>
        {
          (loading && <div className={"content-loading-wrap"}><LoadingLine/></div>)
        }

        {
          posts
            // .slice(0,1)
            .map((p,i)=>
          <PostItem
            key={p.mm_id}
            i={i}
            post={p}
            // upd={this.props.upd}
          />)
        }
      </div>
    )
  }
}

class PostItem extends Component {
  constructor(props) {
    super(props)
    let { post:{post_img=''}={} } = this.props
    this.state = {
      // post_img: post_img,
      // imgLoading: post_img==='api'
    }
  }

  clickHandle = (post) => () => {
    window.open(post.url, '_blank');
    // this.props.upd({
    //   // post.post_img = this.state
    //   popUp__open: true,
    //   // popUp__link: link,
    //   popUp__link: 'local',
    //   popUp__localData: {...post, post_img:this.state.post_img}
    // })
  }
  postMouseLeave = () => {
    // setTimeout(
    //   ()=>{
    //     this.props.upd({topPostsActiveItem: 0})
    //   },0)
  }
  postMouseEnter = (id) => ()=>{
    // setTimeout(
    //   ()=>{
    //     this.props.upd({topPostsActiveItem: id})
    //   },0)
  }

  render() {
    const {post:p, i, post:{optimism, fear, anger, sadness, disgust}} = this.props
    const {post_img, imgLoading} = this.state
    const maxLen = 33;
    return (
      <div
        className="one-post"
        key={p.post_db_id}
        // onClick={this.clickHandle(link)}
        onClick={this.clickHandle(p)}
        onMouseLeave={this.postMouseLeave}
        onMouseEnter={this.postMouseEnter(p.post_db_id)}
      >

        <div className={'number_wrap'}>
          <div className={'number'}>{i + 1}</div>
          <div className={'triangle'}/>
        </div>

        <div className="post-image-container" >
          <div className="post-image" style={{backgroundImage: 'url(' + p.image + ')'}}/>
          <div className="fb-image" style={{backgroundImage: 'url(' + p.fb_page_img + ')'}}/>
        </div>

        <div className={'body-wrap'}>

          <div className="header">
            {/*<div className='fb-page-link'>{p.post_url}</div>*/}
            <div className="created-at">
              <div>{p.dateHmn}</div>
              {/*({p.top_post_score})*/}
            </div>
          </div>

          <div className="message">{p.title}</div>

          {
            (p.post_url) ? (
              <div>
              <a href={p.post_url} target='_blank' className="content-fb-link" >
                  <div className="content-fb-logo" />
                  <div className="fb-external-link" />
              </a>

              <div className="stats">
                <ul>
                  <li>
                    <LikeIcon className={'fb-ico likes-svg'}/>
                    <span>{p.fb_likes}</span>
                  </li>
                  <li>
                    <CommentsIcon className={'fb-ico comments-svg'}/>
                    <span>{p.fb_comments}</span></li>
                  <li>
                    <SharesIcon className={'fb-ico shares-svg'}/>
                    <span>{p.fb_shares}</span>
                  </li>
                </ul>
              </div>
              </div>
            ) : (<div className ={'separator'}/>)
          }
          <EmotionsBox
            theme={'color'}
            limit={3}
            emotions={{
              anger: anger,
              disgust: disgust,
              fear: fear,
              optimism: optimism,
              sadness: sadness,
            }}
            row
            tooltip
          />
          {/*<div className={'emotions'}>*/}
          {/*  <div className={'title'}>Emotions</div>*/}
          {/*  <div className={'em-wrap'}>*/}
          {/*    <div className={'em pos'}>*/}
          {/*      <EmoIcons iClassName={'primary-emo'} emoSize={p.emo[0].value} maxSize={maxLen} svgClassName={'svg-primary'} iconName={p.emo[0].key} />*/}
          {/*      <span className={'per-val'}>{p.emo[0].value}%</span>*/}
          {/*    </div>*/}

          {/*    <div className={'em neg'}>*/}
          {/*      <EmoIcons iClassName={'secondary-emo'} emoSize={(p.emo[0].value/p.emo[1].value)}  svgClassName={'svg-secondary'} iconName={p.emo[1].key} />*/}
          {/*      <span className={'per-val'}>{p.emo[1].value}%</span>*/}
          {/*    </div>*/}

          {/*    <div className={'em neu'}>*/}
          {/*      <EmoIcons iClassName={'third-emo'} emoSize={(p.emo[0].value/p.emo[2].value)} svgClassName={'svg-third'} iconName={p.emo[2].key} />*/}
          {/*      <span className={'per-val'}>{p.emo[2].value}%</span>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
    )
  }
}

export default withGlobalState(TopContent)
