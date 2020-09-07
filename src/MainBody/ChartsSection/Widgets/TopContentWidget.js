import React, {useEffect, useState} from 'react'
import {LoadingLine} from '../../../components/loadingAnimation'
import {withGlobalState} from 'react-globally'
import {CommentsIcon, LinkExternal} from '../../../style/Icons'
import {EmotionsBox} from './EmotionsBox'
import {abbrNum} from '../../../components/tools'

export const TopContentWidget = withGlobalState((props) => {

  const [loading, setLoading]   = useState(false)
  const [postList, setPostList] = useState([])
  const [slide, setSlide]       = useState(0)

  const slidesCount = postList.length

  const btnClick = (n) => {
    let nextSlide = slide + n
    if(slide + n === slidesCount){
      nextSlide = 0
    } else if (slide + n < 0){
      nextSlide = slidesCount - 1
    }
    setSlide(nextSlide)
  }

  useEffect(()=>{
    let {hide=false, value:searchString} = props.data
    if(!hide){
      setLoading(true)
      setPostList([])
      props.apiGetter(props)
        .then(({data}) => {
          setLoading(false)
          setSlide(0)
          setPostList(data
            .slice(0,5)
          )
        })
        .catch(err=>{setLoading(false)})
    }

  },[props.data])

  const mappingData = (posts) => {
    return posts.map(({
      mm_id:id,
      title:postTitle,
      image:pic,
      url,
      anger=0.0,
      disgust=0.0,
      fear=0.0,
      optimism=0.0,
      sadness=0.0,
      fb_comments,
     }) => ({
      id,
      postTitle,
      pic,
      url,
      anger,
      disgust,
      fear,
      optimism,
      sadness,
      fb_comments
    }))

  }


  return(
    <>
      {/*{(true && <LoadingLine/>)}*/}
      <div className={'top-content-widget'}>
      <div className={'title'}>Top Content</div>
      <div className={'loading-wrap'}>
        {loading && <LoadingLine className={'loading'}/>}
      </div>
        <div className={'body'}>
          <div className={'nav-btn left-btn'} onClick={()=>{btnClick(-1)}}/>
          <div className={'slider-box'}>
            <div
              className={'slider'}
              style={{
                width: `calc(100% * ${slidesCount} + ${slidesCount}px)`,
                marginLeft: `calc(-100% * ${slide})`,
              }}
            >

              {
                mappingData(postList).map( (x,idx) => (
                  <div
                    className={'slide' + (idx===slide?' selected':'')}
                    key={x.id}
                    style={{width: `calc(100% / ${slidesCount})`}}
                  >
                    <div className={'slide-content-box'}>


                      <div className={'post'}>
                        <div className={'img'} style={{backgroundImage: `url("${x.pic}")`}}/>
                        <div className={'post-text-box'}>
                          <div className={'title-line'}>
                            {/*<div className={'title'}></div>*/}
                            <div className={'counter'}>{idx+1}/{slidesCount}</div>
                            <div className={'comments-count'}>
                              <span>Comments</span>
                              <CommentsIcon className={'comments-ico'} noWrap />
                              <span>{abbrNum(x.fb_comments)}</span>
                            </div>
                            <a href={x.url} className={'link-ico'} target={'_blank'}><LinkExternal/></a>
                          </div>
                          <div className={'text'}>
                            {x.postTitle}
                          </div>
                        </div>
                      </div>

                      {/*<div className={'comments'}>*/}

                      {/*  <div className={'title-box'}>*/}
                      {/*    <div className={'title'}>Comments</div>*/}
                      {/*    <div className={'comments-ico'}></div>*/}
                      {/*    <div className={'link-ico'}></div>*/}

                      {/*    <div className={'comments-list'}>*/}
                      {/*      <div className={'item'}>*/}
                      {/*        /!*Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.*!/*/}
                      {/*        Lorem Ipsum is simply dummy text of the printing.*/}
                      {/*      </div>*/}
                      {/*    </div>*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                      <div className={'emotions-box-wrap'}>
                        <EmotionsBox
                          theme={'color'}
                          limit={3}
                          emotions={{
                            anger:x.anger,
                            disgust:x.disgust,
                            fear:x.fear,
                            optimism:x.optimism,
                            sadness:x.sadness,
                          }}
                          tooltip
                        />
                      </div>

                    </div>
                  </div>
                ))
              }



            </div>
          </div>
          <div className={'nav-btn right-btn'} onClick={()=>{btnClick(1)}}/>
        </div>
      </div>
    </>
  )
})
