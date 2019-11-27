import * as React from 'react'
import ReactShadowComp from './react-shadowed-component'
import { reactCommonData } from './react-common-data'
import THE_CSS from './react-side-menu.css'

export default class ReactSideMenu extends React.Component {
  // Fields
  static contextType = reactCommonData
  context!: React.ContextType<typeof reactCommonData>
  private _meNavBut!: HTMLInputElement | undefined
  private _meNavMenu!: HTMLElement
  private _meHandlingTrans: boolean

  constructor(theProps: Readonly<{}>) {
    super(theProps)
    this._meHandlingTrans = false
    this._handleWindowClick = this._handleWindowClick.bind(this)
    this._handleChangeEvent = this._handleChangeEvent.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this._handleWindowClick, true)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._handleWindowClick, true)
  }

  private _handleWindowClick(theEvent: MouseEvent) {
    if (this._meNavBut) {
      this._meNavBut.checked = false
      this._meNavBut = undefined
      theEvent.preventDefault()
    }
  }

  private _handleChangeEvent(theEvent: React.ChangeEvent<HTMLInputElement>) {
    theEvent.target.checked && (this._meNavBut = theEvent.target)
  }

  render() {
    return (<ReactShadowComp tag='nav'>
      <style>{THE_CSS}</style>
      <label>
        <input type='checkbox' className='nav-but' onChange={this._handleChangeEvent} />
        <span className='nav-strips'></span>
        <span className='nav-text'>MENU</span>
        <nav className='nav-menu' style={this.context.commonStyle}>
          {this.context.sideMenu.anchors.map((anch, index) => <a href={anch.href} key={index}>{anch.title}</a>)}
        </nav>
      </label>
    </ReactShadowComp>)
  }
}
