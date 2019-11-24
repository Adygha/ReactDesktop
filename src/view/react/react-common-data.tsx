import { createContext } from "react";

export interface IReactSideMenu {
  title: string,
  anchors: {
    title: string,
    href: string
  }[]
}

export interface IReactFlashMessage {
  type: 'msg-info' | 'msg-err',
  message: string
}

export interface IReactCommonData {
  commonProps: {
    [key: string]: string
  }
  commonStyle: {
    [key: string]: string
  },
  sideMenu: IReactSideMenu
}

export const reactCommonData = createContext<IReactCommonData>({
  commonProps: {
    pageTitle: 'Welcome to React App',
    userName: 'Janty Azmat',
    author: 'Janty Azmat',
  },
  commonStyle: {
    backgroundColor: 'slategray',
    color: 'white'
  },
  sideMenu: {
    title: 'MENU',
    anchors: [
      {title: 'msg-err', href: 'This is an Error message test..'},
      {title: 'msg-info', href: 'This is an Info message test..'}
    ]
  }
})

export const reactFlashMessage = createContext<IReactFlashMessage>({
  type: 'msg-info',
  message: ''
})
