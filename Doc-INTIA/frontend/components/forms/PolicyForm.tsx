'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { clientsApi } from '@/lib/api'

interface PolicyFormProps {
  initialData?: {
    id?: number
    policy_number?: string
    client_id: number
    type: string
    coverage: string
    premium: number
    start_date: string
    end_date: string
    status?: string
  }
  onSubmit: (data: any) => Promise<void>
  submitLabel?: string
  isLoading?: boolean
}

export function PolicyForm({ initialData, onSubmit, submitLabel = "Submit", isLoading = false }: PolicyFormProps) {
  const [formData, setFormData] = useState({
    policy_number: initialData?.policy_number || '',
    client_id: initialData?.client_id || 0,
    type: initialData?.type || '',
    coverage: initialData?.coverage || '',
    premium: initialData?.premium?.toString() || '',
    start_date: initialData?.start_date?.split('T')[0] || '',
    end_date: initialData?.end_date?.split('T')[0] || '',
    status: initialData?.status || 'pending'
  })
  const [clients, setClients] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!initialData) {
      fetchClients()
    }
  }, [])

  const fetchClients = async () => {
    try {
      const data = await clientsApi.getAll({ skip: 0, limit: 100 })
      setClients(data.data || [])
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!initialData && !formData.policy_number.trim()) {
      newErrors.policy_number = 'Policy number is required'
    }
    if (!formData.client_id) {
      newErrors.client_id = 'Client is required'
    }
    if (!formData.type.trim()) {
      newErrors.type = 'Type is required'
    }
    if (!formData.coverage.trim()) {
      newErrors.coverage = 'Coverage is required'
    }
    if (!formData.premium || parseFloat(formData.premium) <= 0) {
      newErrors.premium = 'Valid premium amount is required'
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required'
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required'
    }
    if (formData.start_date && formData.end_date && formData.end_date <= formData.start_date) {
      newErrors.end_date = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    const submitData = {
      ...(initialData ? {} : { policy_number: formData.policy_number }),
      client_id: parseInt(formData.client_id.toString()),
      type: formData.type,
      coverage: formData.coverage,
      premium: parseFloat(formData.premium),
      start_date: formData.start_date,
      end_date: formData.end_date,
      ...(initialData ? { status: formData.status } : {})
    }

    await onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Policy Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!initialData && (
            <div className="space-y-2">
              <Label htmlFor="policy_number">Policy Number *</Label>
              <Input
                id="policy_number"
                value={formData.policy_number}
                onChange={(e) => handleChange('policy_number', e.target.value)}
                placeholder="POL-2025-001"
                required
              />
              {errors.policy_number && <p className="text-sm text-red-500">{errors.policy_number}</p>}
            </div>
          )}

          {!initialData && (
            <div className="space-y-2">
              <Label htmlFor="client_id">Client *</Label>
              <Select
                value={formData.client_id.toString()}
                onValueChange={(value) => handleChange('client_id', parseInt(value))}
              >
                <SelectTrigger id="client_id">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.first_name} {client.last_name} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client_id && <p className="text-sm text-red-500">{errors.client_id}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              placeholder="Auto Insurance, Health Insurance, etc."
              required
            />
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverage">Coverage *</Label>
            <Textarea
              id="coverage"
              value={formData.coverage}
              onChange={(e) => handleChange('coverage', e.target.value)}
              placeholder="Description of coverage..."
              rows={4}
              required
            />
            {errors.coverage && <p className="text-sm text-red-500">{errors.coverage}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="premium">Premium (USD) *</Label>
            <Input
              id="premium"
              type="number"
              step="0.01"
              min="0"
              value={formData.premium}
              onChange={(e) => handleChange('premium', e.target.value)}
              placeholder="150000.00"
              required
            />
            {errors.premium && <p className="text-sm text-red-500">{errors.premium}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                required
              />
              {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                required
              />
              {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
            </div>
          </div>

          {initialData && (
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
