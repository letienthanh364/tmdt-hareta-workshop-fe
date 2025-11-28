import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { createContext, useContext, useEffect } from 'react'
import { LocalStorageEventTarget } from './utils/auth'
import { AppContext, AppProvider } from './contexts/app.context'
import { CartContext, CartProvider } from './contexts/cart.context'
import { OrderContext, OrderProvider } from './contexts/order.context'
import LoadingPage from './components/LoadingPage'
import classNames from 'classnames'
import { HelmetProvider } from 'react-helmet-async'
import { StoreProvider } from './contexts/store.context'
import ErrorBoundary from './components/ErrorBoundary'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import 'src/i18n/i18n'
import ScrollToTop from './ScrollToTop'

export type ThemeContextType = 'light' | 'dark'
export const ThemeContext = createContext({
  theme: 'dark',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: () => {}
})

function AppInner() {
  const { handleLogout, loadingPage, theme } = useContext(AppContext)
  const { setExtendedPurchases } = useContext(CartContext)
  const { setOrderList, setTempOrderList } = useContext(OrderContext)

  const routeElements = useRouteElements()

  useEffect(() => {
    const resetFunction = () => {
      handleLogout()

      // Clear purchase list
      setExtendedPurchases([])

      // Clear order list
      setOrderList([])
    }
    LocalStorageEventTarget.addEventListener('clearLS', resetFunction)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', resetFunction)
    }
  }, [handleLogout, setExtendedPurchases, setOrderList, setTempOrderList])

  return (
    <div
      className={classNames('', theme === 'dark' ? 'dark' : 'light')}
      style={{
        minHeight: 'inherit'
      }}
    >
      {routeElements}
      <ToastContainer
        position='top-right'
        autoClose={3000}
        limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      {loadingPage && <LoadingPage />}
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <ScrollToTop>
        <AppProvider>
          <StoreProvider>
            <CartProvider>
              <OrderProvider>
                <ErrorBoundary>
                  <AppInner />
                </ErrorBoundary>
              </OrderProvider>
            </CartProvider>
          </StoreProvider>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ScrollToTop>
    </HelmetProvider>
  )
}

export default App
