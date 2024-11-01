import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MyLayout from './components/layout.jsx'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/home.jsx'
import TradeBuy from './pages/trade.jsx'
import Stocks from './pages/stocks.jsx'
import Services from './pages/services.jsx'
import ContactForm from './pages/contact.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MyLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "trade-buy", element: <TradeBuy /> },
      { path: "stocks-market", element: <Stocks />}, 
      { path: 'services', element: <Services />}, 
      { path: 'contact', element: <ContactForm />}
    ],
  },
]);
createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
