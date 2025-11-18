'use client'

import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'

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

interface ClientTableProps {
  clients: Client[]
  onDelete: (id: number) => Promise<void>
}

export function ClientTable({ clients, onDelete }: ClientTableProps) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this client?')) {
      await onDelete(id)
    }
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Branch</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle">
                <div>
                  <div className="font-medium">{client.first_name} {client.last_name}</div>
                  {client.date_of_birth && (
                    <div className="text-sm text-muted-foreground">
                      DOB: {new Date(client.date_of_birth).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4 align-middle">{client.email}</td>
              <td className="p-4 align-middle">{client.phone}</td>
              <td className="p-4 align-middle">
                <Badge variant="secondary">#{client.branch_id}</Badge>
              </td>
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
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
                          This action cannot be undone. You cannot delete clients with active insurance policies.
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No clients found
        </div>
      )}
    </div>
  )
}
