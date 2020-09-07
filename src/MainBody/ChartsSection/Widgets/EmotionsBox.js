import {EmoIco__Joy, EmoIcons, EmoIconsD256, LikeIcon} from '../../../style/Icons'
import React from 'react'

export const EmotionsBox = ({
                              emotions={
                                optimism: 1,
                                sadness: 0.7,
                                anger: 0.5,
                                disgust: 0.2,
                                fear: 0.1,
                              },
                              theme='white',
                              limit=5,
                              className='',
                              maxIconSize=30,
                              tooltip=false,
                              tooltipInside=false,
                              row=false
                            }) => {

  const maxValue = Math.max(...Object.values(emotions))

  return (
    <div className={'emotions emotions-box-component ' +className}>
      <div className={'emo-title'}>Emotions</div>
      <div className={'emo-smiles-box'} style={{flexDirection: row?'row':'column'}}>
        {
          Object
            .entries(emotions)
            .sort((a,b)=>(b[1]-a[1]))
            .slice(0, limit)
            .map(([key, val]) => {

              let emoWidth = val>0 ? val/maxValue * maxIconSize : 0

              let iconsStyle = {
                width: emoWidth
              }
              if(theme==='white') iconsStyle.color = '#fff'

              return (
                <div className={'emo-item'} key={key}>
                  <div className={'emo-ico-wrap'} style={{width:maxIconSize}}>
                    {tooltip && <div className={'emo-tooltip'}>{key}</div>}
                    <EmoIconsD256
                      type={key}
                      // className={''}
                      style={iconsStyle}
                    />

                  </div>

                  <div className={'emo-val'}>

                    {
                      tooltipInside &&
                      <div className={'tt-inside'}>{key}</div>
                    }

                    <div className={'emo-val-inside-wrap'}>
                      {Intl.NumberFormat('en-US', {style: 'percent'}).format(val)}
                    </div>

                  </div>

                </div>
              )
            })
        }
      </div>
    </div>
  )
}

