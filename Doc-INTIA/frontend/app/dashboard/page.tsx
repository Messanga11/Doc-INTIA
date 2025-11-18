"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Building2, TrendingUp } from "lucide-react";
import { branchesApi, clientsApi, policiesApi } from "@/lib/api";

interface DashboardStats {
  total_clients: number;
  total_policies: number;
  active_policies: number;
  branches: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_clients: 0,
    total_policies: 0,
    active_policies: 0,
    branches: 3,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch clients count (limit=1 to get just metadata)
      const clientsData = await clientsApi.getAll({ skip: 0, limit: 1 });

      // Fetch policies count
      const policiesData = await policiesApi.getAll({ skip: 0, limit: 1 });

      // Fetch active policies
      const activePoliciesData = await policiesApi.getAll({
        skip: 0,
        limit: 1,
        status: "active",
      });

      const branches = (await branchesApi.getAll()) as unknown[];

      setStats({
        total_clients: clientsData.meta?.total || 0,
        total_policies: policiesData.meta?.total || 0,
        active_policies: activePoliciesData.meta?.total || 0,
        branches: branches?.length,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-gray-600">
          Vue d'ensemble du système INTIA Assurance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_clients}</div>
            <p className="text-xs text-muted-foreground">Clients enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Polices d'Assurance
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_policies}</div>
            <p className="text-xs text-muted-foreground">Total des polices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Polices Actives
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_policies}</div>
            <p className="text-xs text-muted-foreground">
              En cours de validité
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Succursales</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.branches}</div>
            <p className="text-xs text-muted-foreground">Points de service</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les fonctionnalités d'activité récente seront disponibles
              prochainement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques par succursale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les statistiques détaillées par succursale seront disponibles
              prochainement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
