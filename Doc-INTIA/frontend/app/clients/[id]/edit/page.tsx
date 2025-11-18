'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientForm } from '@/components/forms/ClientForm'
import { clientsApi } from '@/lib/api'

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

interface PageProps {
  params: {
    id: string
  }
}

export default function EditClientPage({ params }: PageProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchClient()
  }, [params.id])

  const fetchClient = async () => {
    try {
      setLoading(true)
      const data = await clientsApi.getById(parseInt(params.id))
      setClient(data.client)
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        setError('Client not found')
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      await clientsApi.update(parseInt(params.id), formData)
      router.push(`/clients/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (error || !client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Client not found'}</p>
          <Link href="/clients">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/clients/${client.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Client
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Client</h1>
            <p className="text-gray-600">
              {client.first_name} {client.last_name}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <ClientForm
          initialData={client}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          isLoading={false}
        />
      </div>
    </div>
  )
}
