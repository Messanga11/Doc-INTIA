'use client'

import Link from 'next/link'
import { Edit, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

interface PolicyTableProps {
  policies: Policy[]
  onDelete: (id: number) => Promise<void>
}

export function PolicyTable({ policies, onDelete }: PolicyTableProps) {
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

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Policy Number</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Premium</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Valid Period</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{policy.policy_number}</span>
                </div>
              </td>
              <td className="p-4 align-middle">{policy.type}</td>
              <td className="p-4 align-middle">
                <Link href={`/clients/${policy.client_id}`} className="text-primary hover:underline">
                  Client #{policy.client_id}
                </Link>
              </td>
              <td className="p-4 align-middle font-semibold">
                ${parseFloat(policy.premium.toString()).toLocaleString()}
              </td>
              <td className="p-4 align-middle">
                <Badge variant={getStatusBadgeVariant(policy.status)}>
                  {policy.status}
                </Badge>
              </td>
              <td className="p-4 align-middle text-sm text-muted-foreground">
                {new Date(policy.start_date).toLocaleDateString()} - {new Date(policy.end_date).toLocaleDateString()}
              </td>
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
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
                        <AlertDialogAction onClick={() => onDelete(policy.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {policies.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No policies found
        </div>
      )}
    </div>
  )
}
