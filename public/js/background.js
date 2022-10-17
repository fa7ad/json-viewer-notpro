browser.browserAction.onClicked.addListener(function () {
  browser.tabs.create(
    { url: browser.extension.getURL('index.html') },
    function () {}
  )
})

function makeHtmlPage(json) {
  return `
    <!doctype html>
    <head>
      <meta charset="utf-8">
      <title>Loading...</title>
      <link rel="stylesheet" href="${browser.runtime.getURL('/css/main.css')}" />
    </head>
    <html>
    <body data-type='application/json'>
      ${json}
    </body>
    </html>
  `
}

function isRedirect(status) {
  return status >= 300 && status < 400
}

function transformResponseToJSON(details) {
  const filter = browser.webRequest.filterResponseData(details.requestId)

  const dec = new TextDecoder('utf-8')
  const enc = new TextEncoder()
  let content = ''

  filter.ondata = event => {
    content = content + dec.decode(event.data)
  }

  // _event
  filter.onstop = () => {
    let outputDoc = ''

    try {
      outputDoc = makeHtmlPage(content)
    } catch (e) {
      outputDoc = makeHtmlPage(JSON.stringify({ error: e, message: e.message }))
    }

    filter.write(enc.encode(outputDoc))

    filter.disconnect()
  }
}

function detectJSON(event) {
  if (!event.responseHeaders || isRedirect(event.statusCode)) {
    return
  }

  let isJson = false

  const cti = event.responseHeaders.findIndex(
    header => header.name.toLowerCase() === 'content-type'
  )

  const header = event.responseHeaders?.[cti] || {}

  if (header?.value.includes('json')) {
    if (
      typeof browser !== 'undefined' &&
      'filterResponseData' in browser.webRequest
    ) {
      header.value = 'text/html'
      isJson = true
    }
  }

  if (/\.json(?:[?#].*?)?$/i.test(event.url)) {
    isJson = true
  }

  if (isJson) {
    transformResponseToJSON(event)
  }

  return { responseHeaders: event.responseHeaders }
}

browser.webRequest.onHeadersReceived.addListener(
  detectJSON,
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['blocking', 'responseHeaders']
)
