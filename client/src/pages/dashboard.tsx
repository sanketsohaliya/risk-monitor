import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { ChartLineIcon, UserCircleIcon, SettingsIcon, FolderSync, ArrowUpIcon, Target, CoinsIcon, ShieldCheckIcon, ShieldQuestion, EyeIcon, EditIcon, SearchIcon, BarChart3Icon, FileTextIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { User, Portfolio, Goal, AtrqResult } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: portfolios, isLoading: portfoliosLoading } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
  });

  const { data: goals, isLoading: goalsLoading } = useQuery<Goal>({
    queryKey: ["/api/goals"],
  });

  const { data: atrq, isLoading: atrqLoading } = useQuery<AtrqResult>({
    queryKey: ["/api/atrq"],
  });

  const filteredPortfolios = portfolios?.filter(portfolio =>
    portfolio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPortfolios(filteredPortfolios.map(p => p.id));
    } else {
      setSelectedPortfolios([]);
    }
  };

  const handleSelectPortfolio = (portfolioId: string, checked: boolean) => {
    if (checked) {
      setSelectedPortfolios(prev => [...prev, portfolioId]);
    } else {
      setSelectedPortfolios(prev => prev.filter(id => id !== portfolioId));
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const formatPercentage = (value: string) => {
    return `${parseFloat(value).toFixed(1)}%`;
  };

  const getTimeAgo = (date: Date | string) => {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - targetDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minutes ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-emerald-100 text-emerald-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPortfolioTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mutual fund': return 'bg-primary-100 text-primary-800';
      case 'etf portfolio': return 'bg-emerald-100 text-emerald-800';
      case 'bond fund': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <ChartLineIcon className="text-primary-600 text-2xl" size={32} />
              <h1 className="text-xl font-semibold text-slate-800">Portfolio Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <UserCircleIcon className="text-lg" size={20} />
                <span data-testid="user-name">{userLoading ? "Loading..." : user?.name || "User"}</span>
              </div>
              <Button variant="ghost" size="sm" data-testid="button-settings">
                <SettingsIcon size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Goal Section */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">Goals Overview</h2>
                <Button variant="ghost" size="sm" data-testid="button-refresh-goals">
                  <FolderSync className="mr-1" size={16} />
                  Refresh Data
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {goalsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 border border-primary-100">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 border border-primary-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-slate-600">Total Assets</h3>
                        <ArrowUpIcon className="text-emerald-500 text-sm" size={16} />
                      </div>
                      <div className="text-2xl font-bold text-slate-800" data-testid="text-total-assets">
                        {goals ? formatCurrency(goals.totalAssets) : "$0"}
                      </div>
                      <div className="text-sm text-emerald-600 mt-1" data-testid="text-assets-change">
                        {goals ? `+${formatPercentage(goals.assetsChange)} YTD` : "+0% YTD"}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-slate-600">Target Progress</h3>
                        <Target className="text-emerald-500 text-sm" size={16} />
                      </div>
                      <div className="text-2xl font-bold text-slate-800" data-testid="text-target-progress">
                        {goals ? formatPercentage(goals.targetProgress) : "0%"}
                      </div>
                      <div className="text-sm text-emerald-600 mt-1">On Track</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-slate-600">Monthly Income</h3>
                        <CoinsIcon className="text-amber-500 text-sm" size={16} />
                      </div>
                      <div className="text-2xl font-bold text-slate-800" data-testid="text-monthly-income">
                        {goals ? formatCurrency(goals.monthlyIncome) : "$0"}
                      </div>
                      <div className="text-sm text-amber-600 mt-1" data-testid="text-income-change">
                        {goals ? `+${formatPercentage(goals.incomeChange)} vs last month` : "+0% vs last month"}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-slate-600">Risk Score</h3>
                        <ShieldCheckIcon className="text-slate-500 text-sm" size={16} />
                      </div>
                      <div className="text-2xl font-bold text-slate-800" data-testid="text-risk-score">
                        {goals ? `${goals.riskScore}/10` : "0/10"}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">Moderate Risk</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ATRQ Section */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Attitude to Risk Questionnaire (ATRQ)</h2>
              
              {atrqLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-6 text-white">
                    <Skeleton className="h-6 w-32 mb-4 bg-primary-500" />
                    <Skeleton className="h-8 w-24 mb-2 bg-primary-500" />
                    <Skeleton className="h-4 w-20 bg-primary-400" />
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Current Risk Profile</h3>
                      <ShieldQuestion className="text-2xl opacity-80" size={32} />
                    </div>
                    <div className="text-3xl font-bold mb-2" data-testid="text-risk-profile">
                      {atrq?.riskProfile || "N/A"}
                    </div>
                    <div className="text-primary-100 text-sm" data-testid="text-overall-score">
                      Score: {atrq ? `${atrq.overallScore}/10` : "N/A"}
                    </div>
                    <div className="text-primary-100 text-sm" data-testid="text-last-updated">
                      Last Updated: {atrq?.lastUpdated ? (typeof atrq.lastUpdated === 'string' ? new Date(atrq.lastUpdated) : atrq.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Risk Tolerance Breakdown</h4>
                    <div className="space-y-4">
                      {atrq && [
                        { name: "Time Horizon", score: atrq.timeHorizon, color: "bg-primary-500" },
                        { name: "Financial Capacity", score: atrq.financialCapacity, color: "bg-emerald-500" },
                        { name: "Loss Tolerance", score: atrq.lossTolerance, color: "bg-amber-500" },
                        { name: "Risk Experience", score: atrq.riskExperience, color: "bg-red-500" }
                      ].map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                            <span className="font-medium text-slate-700">{category.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-slate-600" data-testid={`text-${category.name.toLowerCase().replace(' ', '-')}-score`}>
                              {category.score}/10
                            </div>
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div 
                                className={`${category.color} h-2 rounded-full`} 
                                style={{ width: `${(parseFloat(category.score) / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="ghost" size="sm" className="mt-4" data-testid="button-retake-assessment">
                        <FolderSync className="mr-1" size={16} />
                        Retake Assessment
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Portfolio Table Section */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <h2 className="text-2xl font-semibold text-slate-800">Portfolio Management</h2>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <Input
                        type="text"
                        placeholder="Search portfolios..."
                        className="pl-10 w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="input-search-portfolios"
                      />
                    </div>
                    <Button 
                      onClick={() => setLocation("/portfolio-summary")}
                      variant="outline"
                      data-testid="button-portfolio-summary"
                    >
                      <FileTextIcon className="mr-2" size={16} />
                      Portfolio Summary
                    </Button>
                    <Button 
                      onClick={() => setLocation("/suitability-monitor")}
                      data-testid="button-suitability-monitor"
                    >
                      <BarChart3Icon className="mr-2" size={16} />
                      Suitability Monitor
                    </Button>
                  </div>
                </div>
              </div>
              
              {portfoliosLoading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedPortfolios.length === filteredPortfolios.length && filteredPortfolios.length > 0}
                                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                data-testid="checkbox-select-all"
                              />
                              <span>Portfolio Name</span>
                            </div>
                          </th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Type</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Value</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Performance</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Risk Level</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Last Updated</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredPortfolios.map((portfolio) => (
                          <tr key={portfolio.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={selectedPortfolios.includes(portfolio.id)}
                                  onCheckedChange={(checked) => handleSelectPortfolio(portfolio.id, checked as boolean)}
                                  data-testid={`checkbox-portfolio-${portfolio.id}`}
                                />
                                <div>
                                  <div className="font-medium text-slate-800" data-testid={`text-portfolio-name-${portfolio.id}`}>
                                    {portfolio.name}
                                  </div>
                                  <div className="text-sm text-slate-500" data-testid={`text-portfolio-id-${portfolio.id}`}>
                                    {portfolio.id.slice(0, 8).toUpperCase()}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge className={getPortfolioTypeColor(portfolio.type)} data-testid={`badge-portfolio-type-${portfolio.id}`}>
                                {portfolio.type}
                              </Badge>
                            </td>
                            <td className="py-4 px-6 font-medium text-slate-800" data-testid={`text-portfolio-value-${portfolio.id}`}>
                              {formatCurrency(portfolio.value)}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <span className="text-emerald-600 font-medium" data-testid={`text-portfolio-performance-${portfolio.id}`}>
                                  +{formatPercentage(portfolio.performance)}
                                </span>
                                <ArrowUpIcon className="text-emerald-500 text-xs" size={12} />
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge className={getRiskLevelColor(portfolio.riskLevel)} data-testid={`badge-portfolio-risk-${portfolio.id}`}>
                                {portfolio.riskLevel}
                              </Badge>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-600" data-testid={`text-portfolio-updated-${portfolio.id}`}>
                              {portfolio.lastUpdated ? getTimeAgo(portfolio.lastUpdated) : "Never"}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" data-testid={`button-view-portfolio-${portfolio.id}`}>
                                  <EyeIcon size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" data-testid={`button-edit-portfolio-${portfolio.id}`}>
                                  <EditIcon size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600" data-testid="text-selection-count">
                        <span>{selectedPortfolios.length}</span> of <span>{filteredPortfolios.length}</span> portfolios selected
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-600">Rows per page:</span>
                        <select className="border border-slate-300 rounded px-2 py-1 text-sm" data-testid="select-rows-per-page">
                          <option>10</option>
                          <option>25</option>
                          <option>50</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
