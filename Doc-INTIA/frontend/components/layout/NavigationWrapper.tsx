'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Navigation } from './Navigation'
import { authApi } from '@/lib/api'

export function NavigationWrapper() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Don't show navigation on login page
    if (pathname === '/login') {
      setIsAuthenticated(false)
      setIsChecking(false)
      return
    }

    // Check authentication status
    const checkAuth = async () => {
      try {
        await authApi.getCurrentUser()
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [pathname])

  // Don't show navigation while checking or if not authenticated
  if (isChecking || !isAuthenticated) {
    return null
  }

  return <Navigation />
}

