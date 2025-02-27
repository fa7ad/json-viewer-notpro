import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import './index.css'

try {
  const content = document.body.textContent
  const jsonData = JSON.parse(content.trim())
  window.json = jsonData
  const root = document.createElement('div')
  root.setAttribute('id', 'rbrahul-awesome-json')
  document.body.innerHTML = ''
  document.body.appendChild(root)
  ReactDOM.render(
    <App json={jsonData} />,
    document.getElementById('rbrahul-awesome-json')
  )
} catch (e) {
  console.error('JSON parsing failed', e);
}
