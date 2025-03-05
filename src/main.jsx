
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@material-ui/core'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <>
    {/* <CssBaseline /> Reset default browser styles */}
    <App />
  </>,
)
