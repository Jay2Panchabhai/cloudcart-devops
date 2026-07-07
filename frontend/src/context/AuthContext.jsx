import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const [token, setToken] = useState(
    localStorage.getItem('cloudcart_token')
  )

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser =
      localStorage.getItem('cloudcart_user')

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [token])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)

    localStorage.setItem(
      'cloudcart_token',
      authToken
    )

    localStorage.setItem(
      'cloudcart_user',
      JSON.stringify(userData)
    )
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    localStorage.removeItem('cloudcart_token')
    localStorage.removeItem('cloudcart_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () =>
  useContext(AuthContext)