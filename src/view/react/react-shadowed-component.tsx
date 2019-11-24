import * as React from 'react'
import { createPortal } from 'react-dom'

interface IReactShadowedComponentState {
  shadowHost: HTMLElement | null,
  shadowRoot: HTMLElement | null
}

export interface IReactShadowedComponentProps {
  mode: 'open' | 'closed',
  delegatesFocus?: boolean,
  children: React.ReactNode, // Must have children
  tag: keyof JSX.IntrinsicElements
}

export default class ReactShadowedComponent extends React.Component<IReactShadowedComponentProps, IReactShadowedComponentState> {

  constructor(theProps: Readonly<IReactShadowedComponentProps>) {
    super(theProps)
    this.state = { shadowHost: null, shadowRoot: null }
  }

  shouldComponentUpdate(nextProps: Readonly<IReactShadowedComponentProps>, nextState: IReactShadowedComponentState) : boolean {
    if (nextState.shadowHost && nextState.shadowHost !== this.state.shadowHost) {
      nextState.shadowRoot = nextState.shadowHost.attachShadow({
        mode: this.props.mode, delegatesFocus: this.props.delegatesFocus
      }) as any as HTMLElement
      return true
    }
    return false
  }

  render() {
    if (typeof window !== 'undefined' && window.document) { // When client renders
      const ShadowHostTag = this.props.tag as 'div'
      if (HTMLElement.prototype && HTMLElement.prototype.attachShadow) { // When Shadow-Dom is supported
        return (<ShadowHostTag ref={theRef => this.setState({ shadowHost: theRef })}>
          {this.state.shadowRoot ? createPortal(this.props.children, this.state.shadowRoot) : <></>}
        </ShadowHostTag>)
      } else { // When no Shadow-Dom support
        return (<ShadowHostTag>{this.props.children}</ShadowHostTag>) // Return normally without using Shadow-Dom
      }
    } else { // When server renders (won't reach here but just in case)
      return (<this.props.tag></this.props.tag>) // Just return an empty tag
    }
  }
}
