'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PolicyForm } from '@/components/forms/PolicyForm'
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

export default function EditPolicyPage({ params }: PageProps) {
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPolicy()
  }, [params.id])

  const fetchPolicy = async () => {
    try {
      setLoading(true)
      const data = await policiesApi.getById(parseInt(params.id))
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

  const handleSubmit = async (formData: any) => {
    try {
      await policiesApi.update(parseInt(params.id), formData)
      router.push(`/policies/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update policy')
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
          <Link href={`/policies/${policy.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Policy
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Policy</h1>
            <p className="text-gray-600">{policy.policy_number}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <PolicyForm
          initialData={policy}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          isLoading={false}
        />
      </div>
    </div>
  )
}
