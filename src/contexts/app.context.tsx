import { useQueryClient } from '@tanstack/react-query'
import { useState, createContext, useEffect } from 'react'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS, getThemeFromLS, setThemeToLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  loadingPage: boolean
  setLoadingPage: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  theme: string
  toggleTheme: () => void
  // logout
  handleLogout: () => void
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  loadingPage: false,
  setLoadingPage: () => null,
  theme: getThemeFromLS(),
  toggleTheme: () => null,
  // logout
  handleLogout: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [loadingPage, setLoadingPage] = useState<boolean>(initialAppContext.loadingPage)
  const [theme, setTheme] = useState<string>(initialAppContext.theme)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    setThemeToLS(newTheme)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setProfile(null)
    queryClient.removeQueries({
      queryKey: ['purchases']
    })
  }

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  })

  return (
    <AppContext.Provider
      value={{
        handleLogout,
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        loadingPage,
        setLoadingPage,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
