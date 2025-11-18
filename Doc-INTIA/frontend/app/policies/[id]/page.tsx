'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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

interface PageProps {
  params: {
    id: string
  }
}

export default function PolicyDetailPage({ params }: PageProps) {
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPolicyDetail()
  }, [params.id])

  const fetchPolicyDetail = async () => {
    try {
      setLoading(true)
      const data: Policy = await policiesApi.getById(parseInt(params.id))
      setPolicy(data)
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        setError('Policy not found')
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    } finally {
      setLoading(false)
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

  if (error || !policy) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Policy not found'}</p>
          <Link href="/policies">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Policies
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
          <Link href="/policies">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Policies
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{policy.policy_number}</h1>
              <p className="text-gray-600">Policy Details</p>
            </div>
          </div>
        </div>
        <Link href={`/policies/${policy.id}/edit`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Policy
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Policy Information</CardTitle>
                <Badge variant={getStatusBadgeVariant(policy.status)}>
                  {policy.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Policy Number</label>
                <p className="text-lg font-semibold">{policy.policy_number}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-lg">{policy.type}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Coverage</label>
                <p className="text-lg whitespace-pre-line">{policy.coverage}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Premium</label>
                <p className="text-lg font-semibold">${policy.premium.toLocaleString()}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Date</label>
                  <p className="text-lg">
                    {new Date(policy.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Date</label>
                  <p className="text-lg">
                    {new Date(policy.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Client ID</label>
                  <p className="text-lg">
                    <Link href={`/clients/${policy.client_id}`} className="text-primary hover:underline">
                      #{policy.client_id}
                    </Link>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Branch ID</label>
                  <p className="text-lg">#{policy.branch_id}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-sm text-gray-500">
                    {new Date(policy.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-sm text-gray-500">
                    {new Date(policy.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/clients/${policy.client_id}`} className="block">
                <Button variant="outline" className="w-full">
                  View Client
                </Button>
              </Link>
              <Link href={`/policies/${policy.id}/edit`} className="block">
                <Button variant="outline" className="w-full">
                  Edit Policy
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
