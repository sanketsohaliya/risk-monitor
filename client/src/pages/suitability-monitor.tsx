import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, SettingsIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { SuitabilityRule, MonitoringField } from "@shared/schema";

export default function SuitabilityMonitor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [dashboardAlerts, setDashboardAlerts] = useState(true);

  const { data: rules, isLoading: rulesLoading } = useQuery<SuitabilityRule[]>({
    queryKey: ["/api/suitability-rules"],
  });

  const { data: fields, isLoading: fieldsLoading } = useQuery<MonitoringField[]>({
    queryKey: ["/api/monitoring-fields"],
  });

  const updateFieldMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MonitoringField> }) => {
      const response = await apiRequest("PUT", `/api/monitoring-fields/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/monitoring-fields"] });
      toast({
        title: "Success",
        description: "Monitoring field updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update monitoring field",
        variant: "destructive",
      });
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SuitabilityRule> }) => {
      const response = await apiRequest("PUT", `/api/suitability-rules/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suitability-rules"] });
      toast({
        title: "Success",
        description: "Suitability rule updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update suitability rule",
        variant: "destructive",
      });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/suitability-rules/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suitability-rules"] });
      toast({
        title: "Success",
        description: "Suitability rule deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete suitability rule",
        variant: "destructive",
      });
    },
  });

  const handleFieldToggle = (fieldId: string, enabled: boolean) => {
    updateFieldMutation.mutate({ id: fieldId, updates: { isEnabled: enabled } });
  };

  const handleFieldThresholdChange = (fieldId: string, threshold: string) => {
    updateFieldMutation.mutate({ id: fieldId, updates: { threshold } });
  };

  const handleFieldAlertLevelChange = (fieldId: string, alertLevel: string) => {
    updateFieldMutation.mutate({ id: fieldId, updates: { alertLevel } });
  };

  const handleRuleToggle = (ruleId: string, isActive: boolean) => {
    updateRuleMutation.mutate({ id: ruleId, updates: { isActive } });
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      deleteRuleMutation.mutate(ruleId);
    }
  };

  const getConditionDescription = (conditions: any): string => {
    if (!conditions || typeof conditions !== 'object') return '';
    
    const conditionStrings = Object.entries(conditions).map(([key, value]: [string, any]) => {
      if (value && typeof value === 'object' && value.operator && value.value !== undefined) {
        return `${key} ${value.operator} ${value.value}`;
      }
      return '';
    }).filter(Boolean);
    
    return conditionStrings.join(' AND ');
  };

  const getActionDescription = (actions: any): string => {
    if (!actions || typeof actions !== 'object') return '';
    return `${actions.alertLevel || 'Unknown'} Alert: ${actions.message || 'No message'}`;
  };

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
              <h1 className="text-xl font-semibold text-slate-800">Suitability Monitor Configuration</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" data-testid="button-reset-default">
                Reset to Default
              </Button>
              <Button data-testid="button-save-configuration">
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customization Fields */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Monitoring Fields</h3>
                <div className="space-y-4">
                  {fieldsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="border border-slate-200 rounded-lg p-4">
                        <Skeleton className="h-6 w-48 mb-3" />
                        <div className="grid grid-cols-2 gap-3">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </div>
                    ))
                  ) : (
                    fields?.map((field) => (
                      <div key={field.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center space-x-3">
                            <Checkbox
                              checked={field.isEnabled ?? false}
                              onCheckedChange={(checked) => handleFieldToggle(field.id, checked as boolean)}
                              data-testid={`checkbox-field-${field.id}`}
                            />
                            <span className="font-medium text-slate-700" data-testid={`text-field-name-${field.id}`}>
                              {field.fieldName}
                            </span>
                          </label>
                          <Button variant="ghost" size="sm" data-testid={`button-field-settings-${field.id}`}>
                            <SettingsIcon size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <label className="block text-slate-600 mb-1">
                              {field.fieldName.includes('Risk') ? 'Tolerance' : field.fieldName.includes('Position') ? 'Max Position (%)' : 'Threshold (%)'}
                            </label>
                            <Input
                              type="number"
                              value={field.threshold || ''}
                              onChange={(e) => handleFieldThresholdChange(field.id, e.target.value)}
                              step={field.fieldName.includes('Risk') ? '0.1' : '1'}
                              data-testid={`input-field-threshold-${field.id}`}
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 mb-1">Alert Level</label>
                            <Select
                              value={field.alertLevel}
                              onValueChange={(value) => handleFieldAlertLevelChange(field.id, value)}
                            >
                              <SelectTrigger data-testid={`select-field-alert-${field.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Info">Info</SelectItem>
                                <SelectItem value="Warning">Warning</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700" data-testid="button-add-custom-field">
                    <PlusIcon className="mr-2" size={16} />
                    Add Custom Field
                  </Button>
                </div>
              </div>
              
              {/* Rules Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Monitoring Rules</h3>
                <div className="space-y-4">
                  {rulesLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="border border-slate-200 rounded-lg p-4">
                        <Skeleton className="h-6 w-32 mb-3" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))
                  ) : (
                    rules?.map((rule) => (
                      <div key={rule.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-slate-700" data-testid={`text-rule-name-${rule.id}`}>
                              {rule.name}
                            </span>
                            <Badge 
                              className={rule.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}
                              data-testid={`badge-rule-status-${rule.id}`}
                            >
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRuleToggle(rule.id, !rule.isActive)}
                              data-testid={`button-toggle-rule-${rule.id}`}
                            >
                              <EditIcon size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteRule(rule.id)}
                              data-testid={`button-delete-rule-${rule.id}`}
                            >
                              <TrashIcon size={16} />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded p-3 text-sm">
                          <div className="font-medium text-slate-700 mb-1" data-testid={`text-rule-conditions-${rule.id}`}>
                            IF {getConditionDescription(rule.conditions)}
                          </div>
                          <div className="text-slate-600 mt-2" data-testid={`text-rule-actions-${rule.id}`}>
                            <span className="font-medium text-amber-600">THEN</span> {getActionDescription(rule.actions)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700" data-testid="button-create-new-rule">
                    <PlusIcon className="mr-2" size={16} />
                    Create New Rule
                  </Button>
                  
                  {/* Alert Settings */}
                  <div className="mt-8">
                    <h4 className="text-md font-semibold text-slate-800 mb-4">Alert Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <Checkbox
                          checked={emailNotifications}
                          onCheckedChange={(checked) => setEmailNotifications(checked as boolean)}
                          data-testid="checkbox-email-notifications"
                        />
                        <span className="text-slate-700">Email notifications</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <Checkbox
                          checked={smsNotifications}
                          onCheckedChange={(checked) => setSmsNotifications(checked as boolean)}
                          data-testid="checkbox-sms-notifications"
                        />
                        <span className="text-slate-700">SMS notifications</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <Checkbox
                          checked={dashboardAlerts}
                          onCheckedChange={(checked) => setDashboardAlerts(checked as boolean)}
                          data-testid="checkbox-dashboard-alerts"
                        />
                        <span className="text-slate-700">Dashboard alerts</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
