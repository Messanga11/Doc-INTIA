'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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

interface Policy {
  id: number
  policy_number: string
  type: string
  status: string
  premium: number
  start_date: string
  end_date: string
}

interface ClientDetailResponse {
  client: Client
  policies: Policy[]
}

interface PageProps {
  params: {
    id: string
  }
}

export default function ClientDetailPage({ params }: PageProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchClientDetail()
  }, [params.id])

  const fetchClientDetail = async () => {
    try {
      setLoading(true)
      const data: ClientDetailResponse = await clientsApi.getById(parseInt(params.id))
      setClient(data.client)
      setPolicies(data.policies)
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
          <Link href="/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {client.first_name} {client.last_name}
            </h1>
            <p className="text-gray-600">Client Details</p>
          </div>
        </div>
        <Link href={`/clients/${client.id}/edit`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Client
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">First Name</label>
                  <p className="text-lg">{client.first_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Name</label>
                  <p className="text-lg">{client.last_name}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{client.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-lg">{client.phone}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-lg whitespace-pre-line">{client.address}</p>
              </div>

              {client.date_of_birth && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-lg">
                    {new Date(client.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-sm text-gray-500">
                    {new Date(client.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-sm text-gray-500">
                    {new Date(client.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policies Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Insurance Policies</CardTitle>
            </CardHeader>
            <CardContent>
              {policies.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No policies found for this client
                </p>
              ) : (
                <div className="space-y-3">
                  {policies.slice(0, 5).map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{policy.policy_number}</p>
                          <p className="text-sm text-gray-600">{policy.type}</p>
                        </div>
                        <Badge
                          variant={
                            policy.status === 'active' ? 'default' :
                            policy.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {policy.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Premium: ${policy.premium}</p>
                        <p>Valid: {new Date(policy.start_date).toLocaleDateString()} - {new Date(policy.end_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {policies.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{policies.length - 5} more policies
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <Link href="/policies">
                  <Button variant="outline" className="w-full">
                    View All Policies
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
