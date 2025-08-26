import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon, ClockIcon, FilterIcon, ExternalLinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { PortfolioBreach, Portfolio, MonitoringField } from "@shared/schema";

export default function PortfolioSummary() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: breaches, isLoading: breachesLoading } = useQuery<PortfolioBreach[]>({
    queryKey: ["/api/portfolio-breaches"],
  });

  const { data: portfolios } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
  });

  const { data: monitoringFields } = useQuery<MonitoringField[]>({
    queryKey: ["/api/monitoring-fields"],
  });

  const updateBreachMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/portfolio-breaches/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio-breaches"] });
      toast({
        title: "Success",
        description: "Breach status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update breach status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (breachId: string, newStatus: string) => {
    updateBreachMutation.mutate({ id: breachId, status: newStatus });
    
    // If "Accept and change" is selected, redirect to client portfolio
    if (newStatus === "Accept and change") {
      // Show a confirmation toast before redirecting
      toast({
        title: "Redirecting to Client Portfolio",
        description: "Taking you to the external portfolio management system to make changes.",
      });
      
      // Delay the redirect slightly to show the toast
      setTimeout(() => {
        window.open(
          "https://auth.fefundinfo.com/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dfefundinfo-advisery-feanalytics-prod%26redirect_uri%3Dhttps%253A%252F%252Fwww.feanalytics.com%252FAuthorise.aspx%26response_type%3Dcode%2520id_token%26scope%3Dopenid%2520profile%2520FEAnalytics%2520analytics-chartsapi-role-read%2520analytics-api-role-read%2520search-api-read%2520nextgen-api-read%2520decumulation-api-role-read%26state%3DOpenIdConnect.AuthenticationProperties%253DWml1j6ByEYk2B3ocABAhX_lvNywKBurdC1eqtTAYkkc1EronoFFk9Bw_1GlLB7ftSrSMTjfN7H7XI5sJqNOdQufo5rW5DhS-fzrz4oSPHA7jO3XEMGtKK7VvlFfWnYw4Ahqsv1t_x-Iy3v-pWf6VguUcLQX7t4jzToZYkNYsaSt29eo_vDR8ZUNlxxoHcJvnyYo1skhcaAl-aNpT9r_41YmzIEjip1V2CyCS10lgxoz1DPjQVp9GgQ_3oFfXxvqg%26response_mode%3Dform_post%26nonce%3D638917783774170459.MTkwMzgzZDgtNGI5My00OTYyLWEwMGYtNzZjZGRjMzA4M2Q3YzYwMGMxYWQtMGM1YS00YjAxLWExNzQtOGEzZTk3NjJmNTEw%26x-client-SKU%3DID_NET461%26x-client-ver%3D5.3.0.0",
          "_blank"
        );
      }, 1500);
    }
  };

  const getPortfolioName = (portfolioId: string): string => {
    const portfolio = portfolios?.find(p => p.id === portfolioId);
    return portfolio?.name || "Unknown Portfolio";
  };

  const getMonitoringFieldName = (fieldId: string): string => {
    const field = monitoringFields?.find(f => f.id === fieldId);
    return field?.fieldName || "Unknown Field";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'accept and change': return 'bg-emerald-100 text-emerald-800';
      case 'accept without change': return 'bg-blue-100 text-blue-800';
      case 'reject': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <ClockIcon size={16} className="text-amber-600" />;
      case 'accept and change': return <CheckCircleIcon size={16} className="text-emerald-600" />;
      case 'accept without change': return <CheckCircleIcon size={16} className="text-blue-600" />;
      case 'reject': return <XCircleIcon size={16} className="text-red-600" />;
      default: return <AlertTriangleIcon size={16} className="text-slate-600" />;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    return targetDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredBreaches = breaches?.filter(breach => {
    const matchesStatus = statusFilter === "all" || breach.status.toLowerCase() === statusFilter.toLowerCase();
    const portfolioName = getPortfolioName(breach.portfolioId).toLowerCase();
    const fieldName = getMonitoringFieldName(breach.monitoringFieldId).toLowerCase();
    const matchesSearch = searchTerm === "" || 
      portfolioName.includes(searchTerm.toLowerCase()) ||
      fieldName.includes(searchTerm.toLowerCase()) ||
      breach.breachCondition.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }) || [];

  const pendingCount = breaches?.filter(b => b.status === "Pending").length || 0;
  const resolvedCount = breaches?.filter(b => b.status !== "Pending").length || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/")}
                data-testid="button-back-dashboard"
              >
                <ArrowLeftIcon size={20} />
              </Button>
              <h1 className="text-xl font-semibold text-slate-800">Portfolio Summary Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200" data-testid="badge-pending-count">
                {pendingCount} Pending
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200" data-testid="badge-resolved-count">
                {resolvedCount} Resolved
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <FilterIcon size={20} className="text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Filters:</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48" data-testid="select-status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accept and change">Accept and Change</SelectItem>
                      <SelectItem value="accept without change">Accept Without Change</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 max-w-md">
                  <Input
                    type="text"
                    placeholder="Search by portfolio, field, or condition..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-testid="input-search-breaches"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breaches Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Rule Breach Summary</span>
              <span className="text-sm font-normal text-slate-500" data-testid="text-breach-count">
                {filteredBreaches.length} breach{filteredBreaches.length !== 1 ? 'es' : ''} found
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {breachesLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                      <Skeleton className="h-8 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredBreaches.length === 0 ? (
              <div className="p-12 text-center">
                <AlertTriangleIcon size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No breaches found</h3>
                <p className="text-slate-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your filters or search terms" 
                    : "All monitoring rules are currently within acceptable ranges"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredBreaches.map((breach) => (
                  <div key={breach.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                      {/* Portfolio and Field Info */}
                      <div className="lg:col-span-2">
                        <div className="mb-3">
                          <h3 className="font-semibold text-slate-800 mb-1" data-testid={`text-portfolio-name-${breach.id}`}>
                            {getPortfolioName(breach.portfolioId)}
                          </h3>
                          <p className="text-sm text-slate-600" data-testid={`text-field-name-${breach.id}`}>
                            Monitoring Field: {getMonitoringFieldName(breach.monitoringFieldId)}
                          </p>
                        </div>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-red-800 mb-1">Breach Condition:</p>
                          <p className="text-sm text-red-700" data-testid={`text-breach-condition-${breach.id}`}>
                            {breach.breachCondition}
                          </p>
                          <p className="text-xs text-red-600 mt-1" data-testid={`text-breach-value-${breach.id}`}>
                            Detected value: {breach.breachValue}
                          </p>
                        </div>
                        
                        <div className="text-xs text-slate-500">
                          <p>Detected: {formatDate(breach.detectedAt)}</p>
                          {breach.resolvedAt && (
                            <p>Resolved: {formatDate(breach.resolvedAt)}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(breach.status)}
                        <Badge className={getStatusColor(breach.status)} data-testid={`badge-breach-status-${breach.id}`}>
                          {breach.status}
                        </Badge>
                      </div>
                      
                      {/* Action Dropdown and Redirect Button */}
                      <div className="flex flex-col space-y-2">
                        <Select
                          value={breach.status}
                          onValueChange={(value) => handleStatusChange(breach.id, value)}
                          disabled={updateBreachMutation.isPending}
                        >
                          <SelectTrigger className="w-48" data-testid={`select-action-${breach.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending Review</SelectItem>
                            <SelectItem value="Accept and change">
                              <div className="flex items-center">
                                <span>Accept and Change</span>
                                <ExternalLinkIcon className="ml-2" size={12} />
                              </div>
                            </SelectItem>
                            <SelectItem value="Accept without change">Accept Without Change</SelectItem>
                            <SelectItem value="Reject">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {breach.status === "Accept and change" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-48 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => {
                              toast({
                                title: "Opening Client Portfolio",
                                description: "Redirecting to external portfolio system.",
                              });
                              window.open(
                                "https://auth.fefundinfo.com/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dfefundinfo-advisery-feanalytics-prod%26redirect_uri%3Dhttps%253A%252F%252Fwww.feanalytics.com%252FAuthorise.aspx%26response_type%3Dcode%2520id_token%26scope%3Dopenid%2520profile%2520FEAnalytics%2520analytics-chartsapi-role-read%2520analytics-api-role-read%2520search-api-read%2520nextgen-api-read%2520decumulation-api-role-read%26state%3DOpenIdConnect.AuthenticationProperties%253DWml1j6ByEYk2B3ocABAhX_lvNywKBurdC1eqtTAYkkc1EronoFFk9Bw_1GlLB7ftSrSMTjfN7H7XI5sJqNOdQufo5rW5DhS-fzrz4oSPHA7jO3XEMGtKK7VvlFfWnYw4Ahqsv1t_x-Iy3v-pWf6VguUcLQX7t4jzToZYkNYsaSt29eo_vDR8ZUNlxxoHcJvnyYo1skhcaAl-aNpT9r_41YmzIEjip1V2CyCS10lgxoz1DPjQVp9GgQ_3oFfXxvqg%26response_mode%3Dform_post%26nonce%3D638917783774170459.MTkwMzgzZDgtNGI5My00OTYyLWEwMGYtNzZjZGRjMzA4M2Q3YzYwMGMxYWQtMGM1YS00YjAxLWExNzQtOGEzZTk3NjJmNTEw%26x-client-SKU%3DID_NET461%26x-client-ver%3D5.3.0.0",
                                "_blank"
                              );
                            }}
                            data-testid={`button-redirect-${breach.id}`}
                          >
                            <ExternalLinkIcon className="mr-2" size={14} />
                            Open Client Portfolio
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}