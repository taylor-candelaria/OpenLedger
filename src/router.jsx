import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App.jsx'
import RouteError from './routes/RouteError.jsx'

const page = (load) => () => load().then((m) => ({ Component: m.default }))

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    errorElement: <RouteError />,
    children: [
      { index: true, lazy: page(() => import('./routes/Home.jsx')) },
      { path: 'learn', lazy: page(() => import('./routes/Learn.jsx')) },
      { path: 'learn/:slug', lazy: page(() => import('./routes/Chapter.jsx')) },
      { path: 'treasuries', lazy: page(() => import('./routes/Treasuries.jsx')) },
      { path: 'bonds-vs-hysa', lazy: page(() => import('./routes/Savings.jsx')) },
      { path: 'savings', element: <Navigate to="/bonds-vs-hysa" replace /> },
      { path: 'state-local', lazy: page(() => import('./routes/StateLocal.jsx')) },
      { path: 'data', lazy: page(() => import('./routes/DataDesk.jsx')) },
      { path: 'explore', lazy: page(() => import('./routes/Explore.jsx')) },
      { path: 'glossary', lazy: page(() => import('./routes/Glossary.jsx')) },
      { path: 'methodology', lazy: page(() => import('./routes/Methodology.jsx')) },
      { path: '*', lazy: page(() => import('./routes/NotFound.jsx')) },
    ],
  },
])
