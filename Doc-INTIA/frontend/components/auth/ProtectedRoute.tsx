'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authApi } from '@/lib/api'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const lastPathname = useRef<string | null>(null)

  useEffect(() => {
    // Don't protect login page
    if (pathname === '/login') {
      setIsChecking(false)
      lastPathname.current = pathname
      return
    }

    // Only check if pathname changed
    if (lastPathname.current === pathname) {
      return
    }

    lastPathname.current = pathname

    const checkAuth = async () => {
      setIsChecking(true)
      try {
        // Verify authentication by trying to get current user
        // Cookie will be sent automatically
        await authApi.getCurrentUser()
        setIsChecking(false)
      } catch (error) {
        // Not authenticated, redirect to login
        setIsChecking(false)
        // Use window.location to avoid router issues
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [pathname])

  // Show loading while checking auth
  if (isChecking && pathname !== '/login') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

