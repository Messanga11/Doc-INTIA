'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Plus, Search, Edit, Trash2, LogIn, LogOut, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { auditApi } from '@/lib/api'

interface AuditLog {
  id: number
  user_id: number
  action: string
  resource_type: string
  resource_id: number
  timestamp: string
  ip_address?: string
  user_agent?: string
  old_values?: any
  new_values?: any
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [resourceFilter, setResourceFilter] = useState<string>('all')

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async (action = 'all', resource = 'all') => {
    try {
      setLoading(true)
      const data = await auditApi.getAll({
        skip: 0,
        limit: 50,
        ...(action !== 'all' && { action }),
        ...(resource !== 'all' && { resource_type: resource })
      })
      setLogs(data.data || [])
    } catch (err) {
      console.error('Failed to fetch audit logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Plus className="w-4 h-4 text-green-500" />
      case 'UPDATE':
        return <Edit className="w-4 h-4 text-blue-500" />
      case 'DELETE':
        return <Trash2 className="w-4 h-4 text-red-500" />
      case 'READ':
        return <Eye className="w-4 h-4 text-gray-500" />
      case 'LOGIN':
        return <LogIn className="w-4 h-4 text-green-500" />
      case 'LOGOUT':
        return <LogOut className="w-4 h-4 text-gray-500" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'LOGIN':
        return 'default'
      case 'UPDATE':
        return 'secondary'
      case 'DELETE':
      case 'LOGOUT':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const handleFilterChange = (action: string, resource: string) => {
    setActionFilter(action)
    setResourceFilter(resource)
    fetchAuditLogs(action, resource)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Journal d'audit</h1>
        <p className="text-gray-600">Historique des actions du système</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={actionFilter} onValueChange={(value) => handleFilterChange(value, resourceFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="READ">Read</SelectItem>
            <SelectItem value="UPDATE">Update</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
            <SelectItem value="LOGOUT">Logout</SelectItem>
          </SelectContent>
        </Select>

        <Select value={resourceFilter} onValueChange={(value) => handleFilterChange(actionFilter, value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by resource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="policy">Policy</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="branch">Branch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getActionIcon(log.action)}
                  <div>
                    <CardTitle className="text-lg">
                      {log.action} - {log.resource_type}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Resource ID: {log.resource_id} | User ID: {log.user_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getActionBadgeVariant(log.action)}>
                    {log.action}
                  </Badge>
                  <Badge variant="outline">
                    {log.resource_type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Timestamp</p>
                  <p className="font-medium">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
                {log.ip_address && (
                  <div>
                    <p className="text-gray-600">IP Address</p>
                    <p className="font-medium">{log.ip_address}</p>
                  </div>
                )}
              </div>
              {log.old_values && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
                  <p className="font-semibold mb-1">Old Values:</p>
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(log.old_values, null, 2)}
                  </pre>
                </div>
              )}
              {log.new_values && (
                <div className="mt-2 p-3 bg-blue-50 rounded text-xs">
                  <p className="font-semibold mb-1">New Values:</p>
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(log.new_values, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No audit logs found
        </div>
      )}
    </div>
  )
}
