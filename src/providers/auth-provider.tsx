'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { API_BASE_URL } from "@/lib/constants"
import { tokenStorage, type StoredAuthState } from "@/lib/token-storage"
import type { AuthUser } from "@/types"

type AuthResponse = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: { email: string; password: string }) => Promise<void>
  register: (payload: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  authorizedFetch: (url: string, init?: RequestInit) => Promise<Response>
  updateUserProfile: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null)

  const applySession = useCallback((payload: StoredAuthState) => {
    setUser(payload.user)
    setAccessToken(payload.accessToken)
    setRefreshToken(payload.refreshToken)
    tokenStorage.save(payload)
  }, [])

  useEffect(() => {
    const stored = tokenStorage.load()
    if (stored) {
      applySession(stored)
    }
    setIsLoading(false)
  }, [applySession])

  const clearSession = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    tokenStorage.clear()
  }, [])

  const handleAuthRequest = useCallback(async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = (await response.json()) as AuthResponse | { message?: string }

    if (!response.ok) {
      throw new Error("message" in data && data.message ? data.message : "Unable to complete request")
    }

    return data as AuthResponse
  }, [])

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      const data = await handleAuthRequest("/api/auth/login", payload)
      applySession(data)
      router.replace("/dashboard")
    },
    [applySession, handleAuthRequest, router],
  )

  const register = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      const data = await handleAuthRequest("/api/auth/register", payload)
      applySession(data)
      router.replace("/dashboard")
    },
    [applySession, handleAuthRequest, router],
  )

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } catch {
      // Intentionally swallow network errors on logout
    } finally {
      clearSession()
      router.replace("/login")
    }
  }, [clearSession, refreshToken, router])

  const refreshSession = useCallback(async () => {
    if (!refreshToken) return null

    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = (async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          })

          const data = (await response.json()) as { accessToken: string; refreshToken: string; message?: string }

          if (!response.ok) {
            throw new Error(data.message ?? "Session refresh failed")
          }

          if (!user) {
            throw new Error("Missing user session")
          }

          const nextState: StoredAuthState = {
            user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }
          applySession(nextState)
          return data.accessToken
        } catch (error) {
          clearSession()
          throw error
        } finally {
          refreshPromiseRef.current = null
        }
      })()
    }

    return refreshPromiseRef.current
  }, [applySession, clearSession, refreshToken, user])

  const authorizedFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const makeRequest = async (token: string | null) => {
        const headers = new Headers(init.headers)

        if (token) {
          headers.set("Authorization", `Bearer ${token}`)
        }

        if (init.body && !(init.body instanceof FormData)) {
          headers.set("Content-Type", "application/json")
        }

        const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`

        return fetch(url, {
          ...init,
          headers,
        })
      }

      let response = await makeRequest(accessToken)
      if (response.status !== 401) {
        return response
      }

      const refreshedToken = await refreshSession()
      if (!refreshedToken) {
        await logout()
        return response
      }

      response = await makeRequest(refreshedToken)
      if (response.status === 401) {
        await logout()
      }

      return response
    },
    [accessToken, logout, refreshSession],
  )

  const updateUserProfile = useCallback(
    (nextUser: AuthUser) => {
      setUser(nextUser)
      if (accessToken && refreshToken) {
        tokenStorage.save({
          user: nextUser,
          accessToken,
          refreshToken,
        })
      }
    },
    [accessToken, refreshToken],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && accessToken),
      isLoading,
      login,
      register,
      logout,
      authorizedFetch,
      updateUserProfile,
    }),
    [accessToken, authorizedFetch, isLoading, login, logout, register, updateUserProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

