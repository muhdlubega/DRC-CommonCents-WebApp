import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'mobx-react';
import './index.css'
import themeStore from './store/ThemeStore.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider themeStore={themeStore}>
    <App themeStore = {themeStore} />
    </Provider>
  </React.StrictMode>
)
