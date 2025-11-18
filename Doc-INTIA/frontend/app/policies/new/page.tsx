'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PolicyForm } from '@/components/forms/PolicyForm'
import { policiesApi } from '@/lib/api'

export default function NewPolicyPage() {
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    try {
      const data = await policiesApi.create(formData)
      router.push(`/policies/${data.id}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create policy')
    }
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
          <div>
            <h1 className="text-3xl font-bold">Add New Policy</h1>
            <p className="text-gray-600">Create a new insurance policy</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <PolicyForm
          onSubmit={handleSubmit}
          submitLabel="Create Policy"
          isLoading={false}
        />
      </div>
    </div>
  )
}
