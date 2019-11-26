import * as React from 'react'
import { reactCommonData } from './react-common-data'
import ReactShadowComp from './react-shadowed-component'
import ReactHeader from './react-header'
import ReactFooter from './react-footer'
import THE_CSS from './react-app.css'

export default class ReactApp extends React.Component {
  // Filed
  static contextType = reactCommonData
  context!: React.ContextType<typeof reactCommonData>

  componentDidMount() {
    document.documentElement.style.height = '100%'
    document.body.style.height = '100%'
    document.body.style.margin = '0'
    document.head.title = this.context.commonProps.pageTitle
  }

  render() {
    if (typeof window !== 'undefined' && window.document) { // When client renders (recommended to be this way for all browsers)
      return (<div>
        <ReactShadowComp tag='div'>
          <style>{THE_CSS}</style>
          <ReactApp.contextType.Provider value={this.context}>
            <ReactHeader />
            <main>
              <p>Hello {this.context.commonProps.userName}.</p>
            </main>
            <ReactFooter />
          </ReactApp.contextType.Provider>
        </ReactShadowComp>
      </div>)
    } else { // When server renders
      return (<div></div>)
    }
  }
}
