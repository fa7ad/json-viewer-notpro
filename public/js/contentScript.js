'use strict'

const isJSONResponse = () =>
  document.contentType === 'application/json' ||
  document.body.dataset['type'] === 'application/json'

const initApplication = () => {
  var styleTag = document.createElement('link')
  var customStyleTag = document.createElement('style')
  var customScriptTag = document.createElement('script')
  customStyleTag.id = 'custom-css'
  var cssFilePath = browser.extension.getURL('/css/main.css')
  var jsFilePath = browser.extension.getURL('/js/main.js')
  styleTag.setAttribute('href', cssFilePath)
  styleTag.rel = 'stylesheet'
  styleTag.type = 'text/css'
  styleTag.id = 'main-css'
  customScriptTag.id = 'custom-script'
  if (document.querySelector('head')) {
    document.querySelector('head').appendChild(styleTag)
  } else {
    var headNode = document.createElement('head')
    document
      .querySelector('html')
      .insertBefore(headNode, document.querySelector('body'))
  }
  document.head.appendChild(styleTag)
  document.head.appendChild(customStyleTag)
  document.head.appendChild(customScriptTag)
  var scriptTag = document.createElement('script')
  scriptTag.setAttribute('src', jsFilePath)
  if (document.querySelector('body')) {
    document.querySelector('body').appendChild(scriptTag)
  } else {
    var body = document.createElement('body')
    document.querySelector('html').appendChild(body)
  }
}

console.log(434343)
if (isJSONResponse()) {
  initApplication()
}
