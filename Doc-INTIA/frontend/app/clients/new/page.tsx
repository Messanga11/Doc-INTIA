'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientForm } from '@/components/forms/ClientForm'
import { clientsApi } from '@/lib/api'

export default function NewClientPage() {
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    try {
      const data = await clientsApi.create(formData) as { id: number }
      router.push(`/clients/${data.id}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create client')
    }
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
            <h1 className="text-3xl font-bold">Add New Client</h1>
            <p className="text-gray-600">Create a new client record</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <ClientForm
          onSubmit={handleSubmit}
          submitLabel="Create Client"
          isLoading={false}
        />
      </div>
    </div>
  )
}
