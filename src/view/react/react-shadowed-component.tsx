import * as React from 'react'
import { createPortal } from 'react-dom'

interface IReactShadowedComponentState {
  shadowHost: HTMLElement | null,
  shadowRoot: HTMLElement | null
}

export interface IReactShadowedComponentProps extends React.HTMLAttributes<HTMLElement> {
  mode: 'open' | 'closed',
  delegatesFocus?: boolean, // Most browsers don't support this
  children: React.ReactNode, // Must have children
  tag: 'article' | 'aside' | 'blockquote' | 'body' | 'div' | 'footer' | 'h1' | 'h2' | 'h3' |
        'h4' | 'h5' | 'h6' | 'header' | 'main' | 'nav' | 'p' | 'section' | 'span'
}

export default class ReactShadowedComponent extends
                React.Component<IReactShadowedComponentProps, IReactShadowedComponentState> {
  // Fields
  static defaultProps = { mode: 'open' }

  constructor(theProps: Readonly<IReactShadowedComponentProps>) {
    super(theProps)
    this.state = { shadowHost: null, shadowRoot: null }
  }

  private _quickUUID() { // From: https://stackoverflow.com/a/13403498
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  shouldComponentUpdate(nextProps: Readonly<IReactShadowedComponentProps>,
                        nextState: IReactShadowedComponentState) : boolean {
    if (nextState.shadowHost && nextState.shadowHost !== this.state.shadowHost) {
      nextState.shadowRoot = nextState.shadowHost.attachShadow({
        mode: this.props.mode, delegatesFocus: this.props.delegatesFocus
      }) as any as HTMLElement
      return true
    }
    return false
  }

  render() {
    const { mode , delegatesFocus, children, tag, className, ...tmpOtherProps} = this.props
    const ShadowHostTag = tag as 'div'
    if (HTMLElement.prototype && HTMLElement.prototype.attachShadow) { // When Shadow-Dom is supported
      return (<ShadowHostTag ref={theRef => this.setState({ shadowHost: theRef })} {...tmpOtherProps}>
        {this.state.shadowRoot ? createPortal(children, this.state.shadowRoot) : <></>}
      </ShadowHostTag>)
    } else { // When no Shadow-Dom support
      let tmpStyleChild: React.ReactElement | undefined
      let tmpNewHostClass: string | undefined
      const tmpOtherChildren = React.Children.map(children, child => {
        const tmpChild = child as React.ReactElement
        if (tmpChild.type && tmpChild.type.toString() === 'style') {
          tmpStyleChild = tmpChild
          tmpNewHostClass = tag + '_' + this._quickUUID()
          // tmpStyleStr = (tmpStyle.props.children as string).replace(':host', '.' + tmpNewHostClass)
          return (<></>)
        }
        return child
      })
      if (tmpStyleChild) { // If there was a 'style' element child (and Shadow-Dom not supported) then change it
        if (tag === 'div') {
          console.log(className ? className + ' ' + tmpNewHostClass : tmpNewHostClass)
          console.log(<ShadowHostTag className={className ? className + ' ' + tmpNewHostClass : tmpNewHostClass}></ShadowHostTag>)
        }
        // Here, we replace any ':host' that is used to indicate a shadow-host with a unique class selector
        // and then prepend every selector with this new unique class selector.
        // The regex part is from: 'https://stackoverflow.com/a/11162506' and changed according to explaination
        let tmpNewStyleStr = ('} ' + tmpStyleChild.props.children) // Silly adding the '} ' part but to go with the regex
          .replace(/([,|\}][\s$]*)([\.#\:\[]?-?[_a-zA-Z]+)/g, '$1.' + tmpNewHostClass + ' $2') // Removes comment
        tmpNewStyleStr = tmpNewStyleStr.substring(2).replace(' :host', '') // Remove unneeded ':host' if exists
        return (<>
          {<style {...tmpStyleChild.props}>
            {tmpNewStyleStr}
          </style>}
          <ShadowHostTag className={className ? className + ' ' + tmpNewHostClass : tmpNewHostClass} {...tmpOtherProps}>{tmpOtherChildren}</ShadowHostTag>
        </>)
      } else { // Here, no need to replace anything and just use children without a shadow
        return (<ShadowHostTag {...tmpOtherProps}>{children}</ShadowHostTag>)
      }
    }
  }
}
