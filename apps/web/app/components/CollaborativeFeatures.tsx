'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Users, 
  Video, 
  MessageCircle, 
  Share2, 
  UserPlus, 
  Settings,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  Phone,
  PhoneOff,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Code,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Copy,
  ExternalLink,
  Calendar,
  MapPin,
  Globe,
  Lock,
  Unlock,
  Crown,
  Award,
  Zap,
  Target,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Heart,
  MessageSquare,
  Share,
  Download,
  Upload,
  DollarSign
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  host: User;
  participants: User[];
  maxParticipants: number;
  isPublic: boolean;
  status: 'scheduled' | 'live' | 'ended';
  startTime: Date;
  endTime?: Date;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  recordingUrl?: string;
  chatMessages: ChatMessage[];
  codeChanges: CodeChange[];
  sharedScreen?: boolean;
  voiceChat?: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'mentor' | 'expert' | 'admin';
  level: number;
  xp: number;
  isOnline: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  currentFile?: string;
  cursorPosition?: { line: number; column: number };
}

export interface ChatMessage {
  id: string;
  user: User;
  message: string;
  timestamp: Date;
  type: 'text' | 'code' | 'system' | 'emoji';
  code?: string;
  language?: string;
  reactions: MessageReaction[];
  isEdited: boolean;
  replyTo?: string;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface CodeChange {
  id: string;
  user: User;
  file: string;
  line: number;
  oldContent: string;
  newContent: string;
  timestamp: Date;
  type: 'insert' | 'delete' | 'replace';
  accepted: boolean;
  comments: CodeComment[];
}

export interface CodeComment {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  line: number;
  resolved: boolean;
  replies: CodeComment[];
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: User[];
  maxMembers: number;
  isPublic: boolean;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  schedule: {
    day: string;
    time: string;
    timezone: string;
  };
  nextSession?: LiveSession;
  resources: string[];
  progress: {
    completed: number;
    total: number;
  };
  createdBy: User;
  createdAt: Date;
}

export interface MentorshipRequest {
  id: string;
  student: User;
  mentor: User;
  subject: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  scheduledAt?: Date;
  duration: number; // in minutes
  price?: number;
  currency?: string;
  tags: string[];
  feedback?: {
    rating: number;
    comment: string;
  };
}

interface CollaborativeFeaturesProps {
  currentUser: User;
  onJoinSession: (sessionId: string) => void;
  onCreateSession: (session: Partial<LiveSession>) => void;
  onJoinStudyGroup: (groupId: string) => void;
  onRequestMentorship: (request: Partial<MentorshipRequest>) => void;
}

export default function CollaborativeFeatures({
  currentUser,
  onJoinSession,
  onCreateSession,
  onJoinStudyGroup,
  onRequestMentorship
}: CollaborativeFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'study-groups' | 'mentorship' | 'live-coding'>('sessions');
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [isInSession, setIsInSession] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    // Mock data - in real implementation, this would come from API
    const mockSessions: LiveSession[] = [
      {
        id: 'session-1',
        title: 'Building Your First Solana Program',
        description: 'Learn the basics of Solana development with hands-on coding',
        host: {
          id: 'user-1',
          name: 'Alice Johnson',
          avatar: '/avatars/alice.png',
          role: 'mentor',
          level: 15,
          xp: 2500,
          isOnline: true,
          isMuted: false,
          isVideoOn: true,
          isScreenSharing: false
        },
        participants: [
          {
            id: 'user-2',
            name: 'Bob Smith',
            avatar: '/avatars/bob.png',
            role: 'student',
            level: 3,
            xp: 450,
            isOnline: true,
            isMuted: false,
            isVideoOn: true,
            isScreenSharing: false
          }
        ],
        maxParticipants: 10,
        isPublic: true,
        status: 'live',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        tags: ['beginner', 'solana', 'rust', 'anchor'],
        difficulty: 'beginner',
        language: 'Rust',
        chatMessages: [],
        codeChanges: []
      }
    ];

    const mockStudyGroups: StudyGroup[] = [
      {
        id: 'group-1',
        name: 'Solana DeFi Developers',
        description: 'Study group focused on building DeFi protocols on Solana',
        members: [
          {
            id: 'user-1',
            name: 'Alice Johnson',
            avatar: '/avatars/alice.png',
            role: 'mentor',
            level: 15,
            xp: 2500,
            isOnline: true,
            isMuted: false,
            isVideoOn: false,
            isScreenSharing: false
          },
          {
            id: 'user-3',
            name: 'Charlie Brown',
            avatar: '/avatars/charlie.png',
            role: 'student',
            level: 7,
            xp: 1200,
            isOnline: false,
            isMuted: false,
            isVideoOn: false,
            isScreenSharing: false
          }
        ],
        maxMembers: 20,
        isPublic: true,
        tags: ['defi', 'intermediate', 'lending', 'dex'],
        difficulty: 'intermediate',
        schedule: {
          day: 'Tuesday',
          time: '7:00 PM',
          timezone: 'UTC'
        },
        resources: [
          'https://docs.solana.com/developing/programming-model/overview',
          'https://docs.anchor-lang.com/'
        ],
        progress: {
          completed: 8,
          total: 12
        },
        createdBy: {
          id: 'user-1',
          name: 'Alice Johnson',
          avatar: '/avatars/alice.png',
          role: 'mentor',
          level: 15,
          xp: 2500,
          isOnline: true,
          isMuted: false,
          isVideoOn: false,
          isScreenSharing: false
        },
        createdAt: new Date('2024-01-01')
      }
    ];

    const mockMentorshipRequests: MentorshipRequest[] = [
      {
        id: 'request-1',
        student: {
          id: 'user-4',
          name: 'David Wilson',
          avatar: '/avatars/david.png',
          role: 'student',
          level: 2,
          xp: 200,
          isOnline: false,
          isMuted: false,
          isVideoOn: false,
          isScreenSharing: false
        },
        mentor: {
          id: 'user-1',
          name: 'Alice Johnson',
          avatar: '/avatars/alice.png',
          role: 'mentor',
          level: 15,
          xp: 2500,
          isOnline: true,
          isMuted: false,
          isVideoOn: false,
          isScreenSharing: false
        },
        subject: 'Understanding Solana Accounts',
        description: 'I need help understanding how accounts work in Solana programs. Specifically, I\'m confused about account ownership and data storage.',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        duration: 60,
        price: 50,
        currency: 'USD',
        tags: ['accounts', 'beginner', 'solana']
      }
    ];

    setLiveSessions(mockSessions);
    setStudyGroups(mockStudyGroups);
    setMentorshipRequests(mockMentorshipRequests);
  }, []);

  const handleJoinSession = (sessionId: string) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setIsInSession(true);
      onJoinSession(sessionId);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !currentSession) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: currentUser,
      message: chatMessage,
      timestamp: new Date(),
      type: 'text',
      reactions: []
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      chatMessages: [...prev.chatMessages, newMessage]
    } : null);

    setChatMessage('');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!currentSession) return;

    setCurrentSession(prev => {
      if (!prev) return null;

      return {
        ...prev,
        chatMessages: prev.chatMessages.map(msg => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions.find(r => r.emoji === emoji);
            if (existingReaction) {
              if (existingReaction.users.includes(currentUser.id)) {
                // Remove reaction
                return {
                  ...msg,
                  reactions: msg.reactions.map(r => 
                    r.emoji === emoji 
                      ? { ...r, users: r.users.filter(id => id !== currentUser.id), count: r.count - 1 }
                      : r
                  ).filter(r => r.count > 0)
                };
              } else {
                // Add reaction
                return {
                  ...msg,
                  reactions: msg.reactions.map(r => 
                    r.emoji === emoji 
                      ? { ...r, users: [...r.users, currentUser.id], count: r.count + 1 }
                      : r
                  )
                };
              }
            } else {
              // New reaction
              return {
                ...msg,
                reactions: [...msg.reactions, { emoji, users: [currentUser.id], count: 1 }]
              };
            }
          }
          return msg;
        })
      };
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'mentor': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'expert': return <Award className="h-4 w-4 text-purple-400" />;
      case 'admin': return <Zap className="h-4 w-4 text-red-400" />;
      default: return <Users className="h-4 w-4 text-blue-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'mentor': return 'text-yellow-400 bg-yellow-400/20';
      case 'expert': return 'text-purple-400 bg-purple-400/20';
      case 'admin': return 'text-red-400 bg-red-400/20';
      default: return 'text-blue-400 bg-blue-400/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-400/20';
      case 'scheduled': return 'text-blue-400 bg-blue-400/20';
      case 'ended': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (isInSession && currentSession) {
    return (
      <div className="h-full flex flex-col bg-black text-white">
        {/* Session Header */}
        <div className="p-4 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  currentSession.status === 'live' ? 'bg-green-400' : 'bg-gray-400'
                )} />
                <h3 className="text-lg font-semibold text-white">{currentSession.title}</h3>
              </div>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(currentSession.status)
              )}>
                {currentSession.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className={cn(
                  "transition-colors",
                  isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
                )}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={cn(
                  "transition-colors",
                  isVideoOn ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
                )}
              >
                {isVideoOn ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={cn(
                  "transition-colors",
                  isScreenSharing ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"
                )}
              >
                {isScreenSharing ? <ScreenShareOff className="h-4 w-4" /> : <ScreenShare className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsInSession(false);
                  setCurrentSession(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Video Grid */}
            <div className="flex-1 p-4 bg-gray-800">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Host Video */}
                <div className="bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">{currentSession.host.name[0]}</span>
                    </div>
                    <h4 className="text-white font-medium">{currentSession.host.name}</h4>
                    <p className="text-gray-400 text-sm">Host</p>
                  </div>
                </div>

                {/* Participants */}
                <div className="space-y-4">
                  {currentSession.participants.map((participant) => (
                    <div key={participant.id} className="bg-gray-900 rounded-lg p-4 flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-lg">{participant.name[0]}</span>
                      </div>
                      <div>
                        <h5 className="text-white font-medium">{participant.name}</h5>
                        <p className="text-gray-400 text-sm">Participant</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="h-64 border-t border-gray-800 bg-gray-900 flex flex-col">
              <div className="p-4 border-b border-gray-800">
                <h4 className="text-sm font-medium text-white">Chat</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentSession.chatMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm">{message.user.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-white">{message.user.name}</span>
                        <span className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{message.message}</p>
                      
                      {/* Reactions */}
                      {message.reactions.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              onClick={() => handleReaction(message.id, reaction.emoji)}
                              className="flex items-center space-x-1 px-2 py-1 bg-gray-800 rounded-full text-xs hover:bg-gray-700 transition-colors"
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-gray-400">{reaction.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Collaborative Learning</h1>
            <p className="text-gray-400">Connect with other developers, join study groups, and get mentorship</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              onClick={() => onCreateSession({})}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              Start Session
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRequestMentorship({})}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Find Mentor
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'sessions', label: 'Live Sessions', icon: Video },
            { id: 'study-groups', label: 'Study Groups', icon: Users },
            { id: 'mentorship', label: 'Mentorship', icon: UserPlus },
            { id: 'live-coding', label: 'Live Coding', icon: Code }
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
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {liveSessions.map((session) => (
                <Card key={session.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getStatusColor(session.status)
                          )}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{session.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{session.participants.length}/{session.maxParticipants}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{session.startTime.toLocaleTimeString()}</span>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getDifficultyColor(session.difficulty)
                      )}>
                        {session.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm">{session.host.name[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{session.host.name}</div>
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(session.host.role)}
                            <span className="text-xs text-gray-400">Host</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {session.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleJoinSession(session.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Session
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'study-groups' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {studyGroups.map((group) => (
                <Card key={group.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{group.name}</h3>
                        <p className="text-sm text-gray-400 mb-3">{group.description}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getDifficultyColor(group.difficulty)
                      )}>
                        {group.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{group.members.length}/{group.maxMembers}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{group.schedule.day} {group.schedule.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{group.progress.completed}/{group.progress.total}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {group.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        onClick={() => onJoinStudyGroup(group.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Join Group
                      </Button>
                      <div className="text-xs text-gray-400">
                        Created {group.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mentorship' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mentorshipRequests.map((request) => (
                <Card key={request.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{request.subject}</h3>
                        <p className="text-sm text-gray-400 mb-3">{request.description}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        request.status === 'pending' ? 'text-yellow-400 bg-yellow-400/20' :
                        request.status === 'accepted' ? 'text-green-400 bg-green-400/20' :
                        request.status === 'rejected' ? 'text-red-400 bg-red-400/20' :
                        'text-gray-400 bg-gray-400/20'
                      )}>
                        {request.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{request.duration} min</span>
                      </div>
                      {request.price && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${request.price} {request.currency}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{request.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm">{request.student.name[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{request.student.name}</div>
                          <div className="text-xs text-gray-400">Student</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm">{request.mentor.name[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{request.mentor.name}</div>
                          <div className="text-xs text-gray-400">Mentor</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {request.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'live-coding' && (
          <div className="text-center py-12">
            <Code className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-4">Live Coding Sessions</h3>
            <p className="text-gray-400 mb-8">
              Real-time collaborative coding sessions where you can code together with other developers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onCreateSession({})}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Video className="h-5 w-5 mr-2" />
                Start Live Coding
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Users className="h-5 w-5 mr-2" />
                Join Session
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
