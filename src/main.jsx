import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const root = document.getElementById('root')

function showError(title, details) {
  root.innerHTML = `<div style="padding:20px;font-family:monospace;font-size:13px;color:#b00020;background:#fff3f3;white-space:pre-wrap;word-break:break-word;min-height:100vh;">
    <h2 style="color:#b00020;">${title}</h2>
    <pre style="white-space:pre-wrap;">${details}</pre>
  </div>`
}

window.onerror = function (message, source, lineno, colno, error) {
  showError('Error caught:', `${message}\nSource: ${source}\nLine: ${lineno}, Col: ${colno}\n\n${error && error.stack ? error.stack : ''}`)
}

window.addEventListener('unhandledrejection', function (event) {
  showError('Promise rejection:', String(event.reason))
})

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (err) {
  showError('Render error:', `${err.message}\n\n${err.stack}`)
}
