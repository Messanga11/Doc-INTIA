'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
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
import { clientsApi, ApiResponse } from '@/lib/api'

interface Client {
  id: number
  branch_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

interface ClientsResponse {
  data: Client[]
  meta: PaginationMeta
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [error, setError] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const hadFocusRef = useRef(false)

  const fetchClients = async (searchQuery = '', page = 1) => {
    // Check if search input had focus before fetch
    hadFocusRef.current = document.activeElement === searchInputRef.current
    
    try {
      setLoading(true)
      const limit = 20
      const skip = (page - 1) * limit
      
      const data = await clientsApi.getAll({
        skip,
        limit,
        ...(searchQuery && { search: searchQuery })
      })
      
      setClients(data.data)
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
  //   fetchClients()
  // }, [])

  // Debounce search
  useEffect(() => {
    // Skip debounce on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const timeoutId = setTimeout(() => {
      fetchClients(search, 1)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [search])

  const handleSearch = (query: string) => {
    setSearch(query)
    // Don't fetch immediately - let the debounce effect handle it
  }

  const handleDelete = async (clientId: number) => {
    try {
      await clientsApi.delete(clientId)
      // Refresh the list
      const currentPage = meta?.page || 1
      fetchClients(search, currentPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client')
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
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link href="/clients/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            placeholder="Search clients..."
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
      </div>

      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {client.first_name} {client.last_name}
                  </CardTitle>
                  <p className="text-gray-600">{client.email}</p>
                  <p className="text-sm text-gray-500">{client.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/clients/${client.id}`}>
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
                        <AlertDialogTitle>Delete Client</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {client.first_name} {client.last_name}?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(client.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{client.address}</p>
              {client.date_of_birth && (
                <Badge variant="secondary">
                  Born: {new Date(client.date_of_birth).toLocaleDateString()}
                </Badge>
              )}
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
                onClick={() => fetchClients(search, page)}
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
