'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { policiesApi } from '@/lib/api'

interface Policy {
  id: number
  policy_number: string
  client_id: number
  branch_id: number
  type: string
  coverage: string
  premium: number
  start_date: string
  end_date: string
  status: string
  created_at: string
  updated_at: string
}

interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

interface PoliciesResponse {
  data: Policy[]
  meta: PaginationMeta
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [error, setError] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const hadFocusRef = useRef(false)

  const fetchPolicies = async (searchQuery = '', status = 'all', page = 1) => {
    // Check if search input had focus before fetch
    hadFocusRef.current = document.activeElement === searchInputRef.current
    
    try {
      setLoading(true)
      const limit = 20
      const skip = (page - 1) * limit
      
      const data = await policiesApi.getAll({
        skip,
        limit,
        ...(status !== 'all' && { status }),
        ...(searchQuery && { search: searchQuery })
      })
      
      setPolicies(data.data)
      setMeta(data.meta!)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Restore focus after loading completes if input had focus before
  useEffect(() => {
    if (!loading && hadFocusRef.current && searchInputRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        searchInputRef.current?.focus()
      })
    }
  }, [loading])

  const isInitialMount = useRef(true)

  // useEffect(() => {
  //   fetchPolicies()
  // }, [])

  // Debounce search and status filter
  useEffect(() => {
    // Skip debounce on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const timeoutId = setTimeout(() => {
      fetchPolicies(search, statusFilter, 1)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [search, statusFilter])

  const handleSearch = (query: string) => {
    setSearch(query)
    // Don't fetch immediately - let the debounce effect handle it
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    // Don't fetch immediately - let the debounce effect handle it
  }

  const handleDelete = async (policyId: number) => {
    try {
      await policiesApi.delete(policyId)
      // Refresh the list
      const currentPage = meta?.page || 1
      fetchPolicies(search, statusFilter, currentPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete policy')
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'cancelled':
      case 'expired':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Polices d'Assurance</h1>
        <Link href="/policies/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Policy
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            placeholder="Search policies..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
              }
            }}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <FileText className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <CardTitle className="text-xl">{policy.policy_number}</CardTitle>
                    <p className="text-gray-600">{policy.type}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusBadgeVariant(policy.status)}>
                        {policy.status}
                      </Badge>
                      <span className="text-sm font-semibold text-gray-700">
                        ${policy.premium.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/policies/${policy.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Policy</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete policy {policy.policy_number}?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(policy.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{policy.coverage}</p>
              <p className="text-sm text-gray-500">
                Valid from {new Date(policy.start_date).toLocaleDateString()} to {new Date(policy.end_date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {meta && meta.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === meta.page ? "default" : "outline"}
                size="sm"
                onClick={() => fetchPolicies(search, statusFilter, page)}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
