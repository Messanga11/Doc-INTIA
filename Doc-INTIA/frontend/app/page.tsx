'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Building2, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">INTIA Assurance</h1>
        <p className="text-gray-600 text-lg">Système de gestion des clients et assurances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/clients">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Clients</CardTitle>
              <CardDescription>Gérer les informations des clients</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Accéder
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/policies">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <FileText className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Assurances</CardTitle>
              <CardDescription>Gérer les polices d'assurance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Accéder
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/branches">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Building2 className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Succursales</CardTitle>
              <CardDescription>Gérer les succursales</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Accéder
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Tableau de bord</CardTitle>
              <CardDescription>Vue d'ensemble et statistiques</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Accéder
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
