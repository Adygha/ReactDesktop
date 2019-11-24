import * as React from "react";

export default class ReactIndex extends React.Component {
  render() {
    return (<html>
      <head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no' />
        <meta charSet='UTF-8' />
        <title></title>
      </head>
      <body>
        <div id='react-app'>{this.props.children}</div>
        <script src='/js/client-bundle.js'></script>
      </body>
    </html>)
  }
}
