import React, {Component} from 'react'
import {SelectCompany} from '../SelectCompany/SelectCompany'

export class NavBar extends Component{
  state = {
    open: false,
  }
  toggleMenu = () => {this.setState({open: !this.state.open})}

  render() {
    const
      open = (this.state.open) ? ' open' : ' close'

    const {
      devModeLocal = false,
      // appName = 'sb',
      pubData = false,
      privData = false,
      radarOnly = false,
      radarShow = true,
    } = window

    const
      sb = (devModeLocal) ? '?app=sb' :'/scoreboard/',
      pls = (devModeLocal) ? '?app=pls' : '/pulse/',
      map = (devModeLocal) ? '?app=map' : '/map/',
      pg = (devModeLocal) ? '?app=pg' : '/pages/',
      cnv = (devModeLocal) ? '?app=cnv' : '/conversations/',
      rad = (devModeLocal) ? '?app=rad' : '/radar/',
      devClass = (devModeLocal) ? ' dev' : ''
    return (
      <>
        <div className={'nav-mobile' + open}/>
        <nav id="mainNavBar" className={'main-nav' + open + devClass}>
          <div className={'nav-bar__wrap'}>

            <a className="main-nav__zavy-logo" href="/" title="Zavy"/>

            <div  id="mainMenu" className="">

              <ul className="app-pages">

                {( (pubData && !radarOnly) &&
                  <>
                    <li className="nav-item"><a href={sb} className={"nav-link nav-link__ico sb-ico" + (appName==='sb'?' active':'')}>Scoreboard</a></li>
                    <li className="nav-item"><a href={pls} className={"nav-link nav-link__ico pls-ico" + (appName==='pls'?' active':'')}>Pulse</a></li>
                    <li className="nav-item"><a href={map} className={"nav-link nav-link__ico map-ico" + (appName==='map'?' active':'')}>Map</a></li>
                    <li className="nav-item"><a href={pg} className={"nav-link nav-link__ico pg-ico" + (appName==='pg'?' active':'')}>Pages</a></li>
                  </>
                )}

                {( (privData && !radarOnly) &&
                  <li className="nav-item"><a href={cnv} className={"nav-link nav-link__ico cnv-ico" + (appName==='cnv'?' active':'')}>Conversation</a></li>
                )}

                {(
                  radarShow && <li className="nav-item"><a href={rad} className={'nav-link nav-link__ico pg-ico' + (appName === 'rad' ? ' active' : '')}>Radar</a></li>
                )}
              </ul>

              <div className={'sep-line'}/>

              <ul className="login-box-li">
                <li className="nav-item"><a className="nav-link" href="/logout/">Logout</a></li>
              </ul>

            </div>

            <div className="login-box">
              <a href="/logout/" title='Logout'>
                <i className="login-md__ico"/>
              </a>
            </div>

            <div className='select-company__wrap'>

              <SelectCompany/>

            </div>

            <div className="navbar-toggler" onClick={this.toggleMenu}/>

          </div>

        </nav>
      </>
    )
  }

}
