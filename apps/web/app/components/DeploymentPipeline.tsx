'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Download,
  Upload,
  GitBranch,
  Code,
  Shield,
  Zap,
  Database,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Save,
  History,
  Activity,
  TrendingUp,
  BarChart3,
  Calendar,
  User,
  GitCommit,
  Tag,
  Branch,
  Merge,
  GitPullRequest,
  AlertCircle,
  Info,
  CheckSquare,
  Square as SquareIcon,
  ChevronDown,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Deployment {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'building' | 'testing' | 'deploying' | 'success' | 'failed' | 'cancelled';
  environment: 'devnet' | 'testnet' | 'mainnet';
  branch: string;
  commit: string;
  commitMessage: string;
  author: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  logs: DeploymentLog[];
  artifacts: DeploymentArtifact[];
  tests: TestResult[];
  metrics: DeploymentMetrics;
  rollbackAvailable: boolean;
  previousDeployment?: string;
}

export interface DeploymentLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  step: string;
}

export interface DeploymentArtifact {
  id: string;
  name: string;
  type: 'program' | 'client' | 'tests' | 'docs';
  size: number;
  url: string;
  checksum: string;
  createdAt: Date;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  coverage?: number;
}

export interface DeploymentMetrics {
  buildTime: number;
  testTime: number;
  deployTime: number;
  totalTime: number;
  successRate: number;
  failureRate: number;
}

export interface Environment {
  id: string;
  name: string;
  type: 'devnet' | 'testnet' | 'mainnet';
  url: string;
  rpcUrl: string;
  explorerUrl: string;
  isActive: boolean;
  lastDeployment?: Date;
  deployments: number;
  successRate: number;
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  repository: string;
  branch: string;
  environments: string[];
  steps: PipelineStep[];
  triggers: PipelineTrigger[];
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  successRate: number;
  totalRuns: number;
}

export interface PipelineStep {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'notify' | 'custom';
  command: string;
  environment?: string;
  dependencies: string[];
  timeout: number;
  retries: number;
  condition?: string;
}

export interface PipelineTrigger {
  id: string;
  type: 'push' | 'pull_request' | 'schedule' | 'manual';
  branch?: string;
  schedule?: string;
  enabled: boolean;
}

interface DeploymentPipelineProps {
  projectId: string;
  onDeploy: (environment: string, branch: string) => void;
  onRollback: (deploymentId: string) => void;
  onCancel: (deploymentId: string) => void;
  onViewLogs: (deploymentId: string) => void;
}

export default function DeploymentPipeline({
  projectId,
  onDeploy,
  onRollback,
  onCancel,
  onViewLogs
}: DeploymentPipelineProps) {
  const [activeTab, setActiveTab] = useState<'deployments' | 'environments' | 'pipelines' | 'metrics'>('deployments');
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'running'>('all');
  const [filterEnvironment, setFilterEnvironment] = useState<'all' | 'devnet' | 'testnet' | 'mainnet'>('all');

  useEffect(() => {
    // Mock data - in real implementation, this would come from API
    const mockDeployments: Deployment[] = [
      {
        id: 'deploy-1',
        name: 'v1.2.3 - NFT Marketplace',
        description: 'Added new auction functionality and improved UI',
        status: 'success',
        environment: 'mainnet',
        branch: 'main',
        commit: 'a1b2c3d4e5f6',
        commitMessage: 'feat: add auction functionality',
        author: 'Alice Johnson',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000), // 5 minutes after creation
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000), // 15 minutes after creation
        duration: 600, // 10 minutes
        logs: [
          {
            id: 'log-1',
            timestamp: new Date(),
            level: 'info',
            message: 'Starting deployment to mainnet',
            source: 'deploy.sh',
            step: 'preparation'
          },
          {
            id: 'log-2',
            timestamp: new Date(),
            level: 'info',
            message: 'Building program with anchor build',
            source: 'anchor',
            step: 'build'
          },
          {
            id: 'log-3',
            timestamp: new Date(),
            level: 'info',
            message: 'Running tests...',
            source: 'anchor test',
            step: 'test'
          },
          {
            id: 'log-4',
            timestamp: new Date(),
            level: 'info',
            message: 'Deploying to mainnet...',
            source: 'solana deploy',
            step: 'deploy'
          },
          {
            id: 'log-5',
            timestamp: new Date(),
            level: 'info',
            message: 'Deployment completed successfully',
            source: 'deploy.sh',
            step: 'completion'
          }
        ],
        artifacts: [
          {
            id: 'artifact-1',
            name: 'nft_marketplace.so',
            type: 'program',
            size: 1024000,
            url: 'https://storage.example.com/artifacts/nft_marketplace.so',
            checksum: 'sha256:abc123...',
            createdAt: new Date()
          }
        ],
        tests: [
          {
            id: 'test-1',
            name: 'test_initialize_marketplace',
            status: 'passed',
            duration: 1.2,
            coverage: 85
          },
          {
            id: 'test-2',
            name: 'test_create_auction',
            status: 'passed',
            duration: 2.1,
            coverage: 90
          }
        ],
        metrics: {
          buildTime: 120,
          testTime: 180,
          deployTime: 300,
          totalTime: 600,
          successRate: 95,
          failureRate: 5
        },
        rollbackAvailable: true,
        previousDeployment: 'deploy-0'
      },
      {
        id: 'deploy-2',
        name: 'v1.2.2 - Bug Fixes',
        description: 'Fixed critical bug in token transfer',
        status: 'failed',
        environment: 'testnet',
        branch: 'main',
        commit: 'b2c3d4e5f6g7',
        commitMessage: 'fix: resolve token transfer bug',
        author: 'Bob Smith',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 2 * 60 * 1000),
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 8 * 60 * 1000),
        duration: 360,
        logs: [
          {
            id: 'log-6',
            timestamp: new Date(),
            level: 'error',
            message: 'Test failed: test_token_transfer',
            source: 'anchor test',
            step: 'test'
          }
        ],
        artifacts: [],
        tests: [
          {
            id: 'test-3',
            name: 'test_token_transfer',
            status: 'failed',
            duration: 0.5,
            error: 'Assertion failed: expected 1000, got 999'
          }
        ],
        metrics: {
          buildTime: 90,
          testTime: 60,
          deployTime: 0,
          totalTime: 360,
          successRate: 0,
          failureRate: 100
        },
        rollbackAvailable: false
      }
    ];

    const mockEnvironments: Environment[] = [
      {
        id: 'env-1',
        name: 'Development',
        type: 'devnet',
        url: 'https://devnet.example.com',
        rpcUrl: 'https://api.devnet.solana.com',
        explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
        isActive: true,
        lastDeployment: new Date(Date.now() - 30 * 60 * 1000),
        deployments: 45,
        successRate: 92
      },
      {
        id: 'env-2',
        name: 'Staging',
        type: 'testnet',
        url: 'https://testnet.example.com',
        rpcUrl: 'https://api.testnet.solana.com',
        explorerUrl: 'https://explorer.solana.com/?cluster=testnet',
        isActive: true,
        lastDeployment: new Date(Date.now() - 2 * 60 * 60 * 1000),
        deployments: 23,
        successRate: 87
      },
      {
        id: 'env-3',
        name: 'Production',
        type: 'mainnet',
        url: 'https://app.example.com',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        explorerUrl: 'https://explorer.solana.com',
        isActive: true,
        lastDeployment: new Date(Date.now() - 2 * 60 * 60 * 1000),
        deployments: 12,
        successRate: 100
      }
    ];

    const mockPipelines: Pipeline[] = [
      {
        id: 'pipeline-1',
        name: 'Main Pipeline',
        description: 'Primary deployment pipeline for main branch',
        repository: 'github.com/example/nft-marketplace',
        branch: 'main',
        environments: ['devnet', 'testnet', 'mainnet'],
        steps: [
          {
            id: 'step-1',
            name: 'Build',
            type: 'build',
            command: 'anchor build',
            dependencies: [],
            timeout: 300,
            retries: 2
          },
          {
            id: 'step-2',
            name: 'Test',
            type: 'test',
            command: 'anchor test',
            dependencies: ['step-1'],
            timeout: 600,
            retries: 1
          },
          {
            id: 'step-3',
            name: 'Deploy to Devnet',
            type: 'deploy',
            command: 'anchor deploy --provider.cluster devnet',
            environment: 'devnet',
            dependencies: ['step-2'],
            timeout: 300,
            retries: 2
          }
        ],
        triggers: [
          {
            id: 'trigger-1',
            type: 'push',
            branch: 'main',
            enabled: true
          }
        ],
        isActive: true,
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
        successRate: 95,
        totalRuns: 20
      }
    ];

    setDeployments(mockDeployments);
    setEnvironments(mockEnvironments);
    setPipelines(mockPipelines);
  }, []);

  const filteredDeployments = deployments.filter(deployment => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'success' && deployment.status === 'success') ||
      (filterStatus === 'failed' && deployment.status === 'failed') ||
      (filterStatus === 'running' && ['pending', 'building', 'testing', 'deploying'].includes(deployment.status));
    
    const matchesEnvironment = filterEnvironment === 'all' || deployment.environment === filterEnvironment;
    
    return matchesStatus && matchesEnvironment;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'building': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'testing': return <Zap className="h-4 w-4 text-purple-400 animate-pulse" />;
      case 'deploying': return <Rocket className="h-4 w-4 text-orange-400 animate-bounce" />;
      case 'cancelled': return <Square className="h-4 w-4 text-gray-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'building': return 'text-blue-400 bg-blue-400/20';
      case 'testing': return 'text-purple-400 bg-purple-400/20';
      case 'deploying': return 'text-orange-400 bg-orange-400/20';
      case 'cancelled': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'devnet': return 'text-blue-400 bg-blue-400/20';
      case 'testnet': return 'text-yellow-400 bg-yellow-400/20';
      case 'mainnet': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Deployment Pipeline</h1>
            <p className="text-gray-400">Manage deployments, environments, and CI/CD pipelines</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              onClick={() => onDeploy('devnet', 'main')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Deploy Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'deployments', label: 'Deployments', icon: Rocket },
            { id: 'environments', label: 'Environments', icon: Globe },
            { id: 'pipelines', label: 'Pipelines', icon: GitBranch },
            { id: 'metrics', label: 'Metrics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'deployments' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="running">Running</option>
              </select>
              
              <select
                value={filterEnvironment}
                onChange={(e) => setFilterEnvironment(e.target.value as any)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Environments</option>
                <option value="devnet">Devnet</option>
                <option value="testnet">Testnet</option>
                <option value="mainnet">Mainnet</option>
              </select>
            </div>

            {/* Deployments List */}
            <div className="space-y-4">
              {filteredDeployments.map((deployment) => (
                <Card key={deployment.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{deployment.name}</h3>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1",
                            getStatusColor(deployment.status)
                          )}>
                            {getStatusIcon(deployment.status)}
                            <span>{deployment.status}</span>
                          </span>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getEnvironmentColor(deployment.environment)
                          )}>
                            {deployment.environment}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{deployment.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <GitCommit className="h-3 w-3" />
                            <span>{deployment.commit.slice(0, 8)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitBranch className="h-3 w-3" />
                            <span>{deployment.branch}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{deployment.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{deployment.duration ? formatDuration(deployment.duration) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedDeployment(deployment)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      {deployment.status === 'failed' && (
                        <Button
                          size="sm"
                          onClick={() => onDeploy(deployment.environment, deployment.branch)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      )}
                      
                      {deployment.rollbackAvailable && (
                        <Button
                          size="sm"
                          onClick={() => onRollback(deployment.id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <History className="h-4 w-4 mr-2" />
                          Rollback
                        </Button>
                      )}
                      
                      {['pending', 'building', 'testing', 'deploying'].includes(deployment.status) && (
                        <Button
                          size="sm"
                          onClick={() => onCancel(deployment.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'environments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {environments.map((environment) => (
                <Card key={environment.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{environment.name}</h3>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getEnvironmentColor(environment.type)
                          )}>
                            {environment.type}
                          </span>
                          {environment.isActive && (
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{environment.url}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Deployments:</span>
                        <span className="text-white">{environment.deployments}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-white">{environment.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Last Deployment:</span>
                        <span className="text-white">
                          {environment.lastDeployment?.toLocaleDateString() || 'Never'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => onDeploy(environment.type, 'main')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Rocket className="h-4 w-4 mr-2" />
                        Deploy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(environment.explorerUrl, '_blank')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pipelines' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pipelines.map((pipeline) => (
                <Card key={pipeline.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{pipeline.name}</h3>
                          {pipeline.isActive && (
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{pipeline.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <GitBranch className="h-3 w-3" />
                            <span>{pipeline.branch}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="h-3 w-3" />
                            <span>{pipeline.totalRuns} runs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{pipeline.successRate}% success</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-white">Steps:</h4>
                      {pipeline.steps.map((step) => (
                        <div key={step.id} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-gray-300">{step.name}</span>
                          <span className="text-gray-500">({step.type})</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => onDeploy('devnet', pipeline.branch)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run Pipeline
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">95%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">2.3m</div>
                  <div className="text-sm text-gray-400">Avg Build Time</div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">45</div>
                  <div className="text-sm text-gray-400">Total Deployments</div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">12h</div>
                  <div className="text-sm text-gray-400">Last Deployment</div>
                </div>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Deployment History</h3>
                <div className="space-y-3">
                  {deployments.slice(0, 5).map((deployment) => (
                    <div key={deployment.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(deployment.status)}
                        <div>
                          <div className="text-sm font-medium text-white">{deployment.name}</div>
                          <div className="text-xs text-gray-400">{deployment.environment}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {deployment.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Deployment Details Modal */}
      {selectedDeployment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{selectedDeployment.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDeployment(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Overview</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className="ml-2 text-white">{selectedDeployment.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Environment:</span>
                      <span className="ml-2 text-white">{selectedDeployment.environment}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <span className="ml-2 text-white">
                        {selectedDeployment.duration ? formatDuration(selectedDeployment.duration) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Author:</span>
                      <span className="ml-2 text-white">{selectedDeployment.author}</span>
                    </div>
                  </div>
                </div>

                {/* Logs */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Deployment Logs</h3>
                  <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {selectedDeployment.logs.map((log) => (
                      <div key={log.id} className="flex items-start space-x-3 mb-2 text-sm">
                        <span className="text-gray-400 w-20">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <span className={cn(
                          "w-16 text-xs px-2 py-1 rounded",
                          log.level === 'error' ? 'bg-red-400/20 text-red-400' :
                          log.level === 'warning' ? 'bg-yellow-400/20 text-yellow-400' :
                          log.level === 'info' ? 'bg-blue-400/20 text-blue-400' :
                          'bg-gray-400/20 text-gray-400'
                        )}>
                          {log.level}
                        </span>
                        <span className="text-white flex-1">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tests */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Test Results</h3>
                  <div className="space-y-2">
                    {selectedDeployment.tests.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                        <div className="flex items-center space-x-3">
                          {test.status === 'passed' ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400" />
                          )}
                          <span className="text-white">{test.name}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {test.duration}s
                          {test.coverage && ` (${test.coverage}% coverage)`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
