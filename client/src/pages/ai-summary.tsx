import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeftIcon, 
  FileDownIcon, 
  BrainIcon, 
  TrendingUpIcon, 
  AlertTriangleIcon,
  CheckCircleIcon,
  BarChart3Icon,
  PieChartIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AISummary() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState<any>(null);

  // Get selected portfolio from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const portfolioId = urlParams.get('portfolio') || localStorage.getItem('selectedPortfolioId');
    setSelectedPortfolioId(portfolioId);
  }, []);

  // Fetch portfolio data
  const { data: portfolios = [] } = useQuery({
    queryKey: ['/api/portfolios'],
  });

  // Fetch portfolio breaches
  const { data: breaches = [] } = useQuery({
    queryKey: ['/api/portfolio-breaches'],
  });

  // Fetch ATRQ data
  const { data: atrqData } = useQuery({
    queryKey: ['/api/atrq'],
  });

  // Find selected portfolio
  const selectedPortfolio = (portfolios as any[]).find((p: any) => p.id === selectedPortfolioId);

  // Filter breaches for selected portfolio
  const portfolioBreaches = (breaches as any[]).filter((b: any) => b.portfolioId === selectedPortfolioId);

  // AI Summary generation mutation
  const generateSummaryMutation = useMutation({
    mutationFn: async (portfolioId: string) => {
      const response = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolioId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate AI summary');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const report = {
        portfolioName: selectedPortfolio?.name,
        generatedAt: new Date().toISOString(),
        ...data
      };
      setAiSummary(report);
      toast({
        title: "AI Summary Generated",
        description: "Portfolio analysis report has been successfully created.",
      });
    },
    onError: (error) => {
      console.error("Failed to generate AI summary:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI summary. Please try again.",
        variant: "destructive",
      });
    }
  });

  const generateAISummary = async () => {
    if (!selectedPortfolio) return;
    generateSummaryMutation.mutate(selectedPortfolio.id);
  };

  const downloadReport = () => {
    if (!aiSummary) return;
    
    // Create a simple text report for download
    const reportText = `
PORTFOLIO ANALYSIS REPORT
Generated: ${new Date(aiSummary.generatedAt).toLocaleString()}

Portfolio: ${aiSummary.portfolioName}
Total Value: £${aiSummary.keyMetrics.totalValue?.toLocaleString()}

EXECUTIVE SUMMARY
${aiSummary.executiveSummary}

RISK ASSESSMENT
Overall Risk: ${aiSummary.riskAssessment.overallRisk}
ATRQ Score: ${aiSummary.riskAssessment.atrqScore}/100
${aiSummary.riskAssessment.riskAlignment}

PORTFOLIO COMPOSITION
${aiSummary.portfolioComposition.map((item: any) => 
  `${item.category}: ${item.percentage}% (£${item.value?.toLocaleString()})`
).join('\n')}

BREACH ANALYSIS
Total Breaches: ${aiSummary.breachAnalysis.totalBreaches}
Critical: ${aiSummary.breachAnalysis.criticalBreaches}
Resolved: ${aiSummary.breachAnalysis.resolvedBreaches}
${aiSummary.breachAnalysis.breachSummary}

RECOMMENDATIONS
${aiSummary.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}

KEY METRICS
Expected Return: ${aiSummary.keyMetrics.expectedReturn}
Volatility: ${aiSummary.keyMetrics.volatility}
Sharpe Ratio: ${aiSummary.keyMetrics.sharpeRatio}
Max Drawdown: ${aiSummary.keyMetrics.maxDrawdown}
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${aiSummary.portfolioName}_AI_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "AI summary report has been downloaded successfully.",
    });
  };

  if (!selectedPortfolioId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setLocation('/')}
                className="flex items-center space-x-2"
                data-testid="button-back-dashboard"
              >
                <ArrowLeftIcon size={16} />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">AI Portfolio Summary</h1>
                <p className="text-slate-600">AI-powered portfolio analysis and reporting</p>
              </div>
            </div>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <BrainIcon className="mx-auto mb-4 text-slate-400" size={48} />
              <h3 className="text-lg font-semibold mb-2">No Portfolio Selected</h3>
              <p className="text-slate-600 mb-4">
                Please select a portfolio from the Dashboard to generate an AI summary report.
              </p>
              <Button onClick={() => setLocation('/')} data-testid="button-select-portfolio">
                Select Portfolio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
              className="flex items-center space-x-2"
              data-testid="button-back-dashboard"
            >
              <ArrowLeftIcon size={16} />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI Portfolio Summary</h1>
              <p className="text-slate-600">AI-powered analysis for {selectedPortfolio?.name}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={generateAISummary}
              disabled={generateSummaryMutation.isPending}
              className="flex items-center space-x-2"
              data-testid="button-generate-summary"
            >
              <BrainIcon size={16} />
              <span>{generateSummaryMutation.isPending ? 'Generating...' : 'Generate AI Summary'}</span>
            </Button>
            
            {aiSummary && (
              <Button
                variant="outline"
                onClick={downloadReport}
                className="flex items-center space-x-2"
                data-testid="button-download-report"
              >
                <FileDownIcon size={16} />
                <span>Download Report</span>
              </Button>
            )}
          </div>
        </div>

        {generateSummaryMutation.isPending && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <BrainIcon className="animate-pulse text-blue-600" size={24} />
                <div>
                  <h3 className="font-semibold">Generating AI Analysis...</h3>
                  <p className="text-sm text-slate-600">
                    Analyzing portfolio composition, risk factors, and suitability breaches
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {aiSummary && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BrainIcon size={20} />
                  <span>Executive Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{aiSummary.executiveSummary}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span>Generated: {new Date(aiSummary.generatedAt).toLocaleString()}</span>
                  <Badge variant="outline">AI Generated</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUpIcon size={20} />
                    <span>Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Risk Level</span>
                      <Badge variant={aiSummary.riskAssessment.overallRisk === 'High' ? 'destructive' : 'default'}>
                        {aiSummary.riskAssessment.overallRisk}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">ATRQ Score</span>
                      <span className="font-semibold">{aiSummary.riskAssessment.atrqScore}/100</span>
                    </div>
                    <Separator />
                    <p className="text-sm text-slate-600">{aiSummary.riskAssessment.riskAlignment}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Breach Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangleIcon size={20} />
                    <span>Suitability Breach Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">{aiSummary.breachAnalysis.totalBreaches}</div>
                        <div className="text-xs text-slate-500">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{aiSummary.breachAnalysis.criticalBreaches}</div>
                        <div className="text-xs text-slate-500">Critical</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{aiSummary.breachAnalysis.resolvedBreaches}</div>
                        <div className="text-xs text-slate-500">Resolved</div>
                      </div>
                    </div>
                    <Separator />
                    <p className="text-sm text-slate-600">{aiSummary.breachAnalysis.breachSummary}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon size={20} />
                  <span>Portfolio Composition</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {aiSummary.portfolioComposition.map((item: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="text-lg font-semibold">{item.percentage}%</div>
                      <div className="text-sm font-medium text-slate-700">{item.category}</div>
                      <div className="text-xs text-slate-500">£{item.value?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3Icon size={20} />
                  <span>Key Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{aiSummary.keyMetrics.expectedReturn}</div>
                    <div className="text-sm text-slate-500">Expected Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-900">{aiSummary.keyMetrics.volatility}</div>
                    <div className="text-sm text-slate-500">Volatility</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{aiSummary.keyMetrics.sharpeRatio}</div>
                    <div className="text-sm text-slate-500">Sharpe Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-600">{aiSummary.keyMetrics.maxDrawdown}</div>
                    <div className="text-sm text-slate-500">Max Drawdown</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-900">£{aiSummary.keyMetrics.totalValue?.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircleIcon size={20} />
                  <span>AI Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiSummary.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                        {index + 1}
                      </div>
                      <p className="text-sm text-slate-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}