'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Menu, 
  X, 
  Search,
  Code,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  Upload,
  Share,
  Copy,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalZero,
  Sun,
  Moon,
  Palette,
  Type,
  Layout,
  Grid,
  List,
  Columns,
  Rows,
  Touch,
  MousePointer,
  Keyboard,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  MapPin,
  Globe,
  Lock,
  Unlock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Heart,
  Bookmark,
  Tag,
  Filter,
  Sort,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  User,
  Bell,
  Mail,
  MessageCircle,
  Phone,
  Video,
  Calendar,
  Clock,
  Map,
  Navigation,
  Compass,
  Target,
  Zap,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Database,
  Server,
  Cloud,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi as WifiIcon,
  Bluetooth,
  Usb,
  Headphones,
  Speaker,
  Mic as MicIcon,
  Camera as CameraIcon,
  Flashlight,
  FlashlightOff
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  userAgent: string;
  platform: string;
  isTouchDevice: boolean;
  hasKeyboard: boolean;
  hasMouse: boolean;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  batteryLevel?: number;
  isOnline: boolean;
}

export interface MobileSettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  theme: 'light' | 'dark' | 'auto';
  layout: 'compact' | 'comfortable' | 'spacious';
  gestures: {
    swipeNavigation: boolean;
    pinchZoom: boolean;
    longPress: boolean;
    doubleTap: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    voiceControl: boolean;
  };
  performance: {
    lowPowerMode: boolean;
    dataSaver: boolean;
    offlineMode: boolean;
    cacheSize: number;
  };
}

interface MobileOptimizationProps {
  deviceInfo: DeviceInfo;
  onSettingsChange: (settings: MobileSettings) => void;
  onLayoutChange: (layout: string) => void;
  onThemeChange: (theme: string) => void;
}

export default function MobileOptimization({
  deviceInfo,
  onSettingsChange,
  onLayoutChange,
  onThemeChange
}: MobileOptimizationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'settings' | 'accessibility' | 'performance'>('layout');
  const [mobileSettings, setMobileSettings] = useState<MobileSettings>({
    fontSize: 'medium',
    theme: 'dark',
    layout: 'comfortable',
    gestures: {
      swipeNavigation: true,
      pinchZoom: true,
      longPress: true,
      doubleTap: true
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      voiceControl: false
    },
    performance: {
      lowPowerMode: false,
      dataSaver: false,
      offlineMode: false,
      cacheSize: 100
    }
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    // Detect device orientation changes
    const handleOrientationChange = () => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      setOrientation(newOrientation);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Detect keyboard visibility (simplified)
    const handleResize = () => {
      const heightDiff = window.screen.height - window.innerHeight;
      setIsKeyboardVisible(heightDiff > 150);
    };

    window.addEventListener('resize', handleResize);

    // Detect fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleSettingsChange = (newSettings: Partial<MobileSettings>) => {
    const updatedSettings = { ...mobileSettings, ...newSettings };
    setMobileSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'tablet': return <Tablet className="h-5 w-5" />;
      case 'desktop': return <Monitor className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'wifi': return <Wifi className="h-4 w-4 text-green-400" />;
      case 'cellular': return <Signal className="h-4 w-4 text-blue-400" />;
      case 'ethernet': return <Wifi className="h-4 w-4 text-purple-400" />;
      default: return <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getBatteryIcon = (level?: number) => {
    if (level === undefined) return <Battery className="h-4 w-4 text-gray-400" />;
    if (level < 20) return <BatteryLow className="h-4 w-4 text-red-400" />;
    return <Battery className="h-4 w-4 text-green-400" />;
  };

  if (deviceInfo.type === 'desktop') {
    return null; // Don't show mobile optimization on desktop
  }

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Mobile Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getDeviceIcon(deviceInfo.type)}
            <div>
              <h3 className="text-lg font-semibold text-white">Mobile IDE</h3>
              <p className="text-sm text-gray-400">
                {deviceInfo.width} × {deviceInfo.height} • {orientation}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getConnectionIcon(deviceInfo.connectionType)}
            {getBatteryIcon(deviceInfo.batteryLevel)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={() => setActiveTab('layout')}
                className={cn(
                  "justify-start",
                  activeTab === 'layout' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                )}
              >
                <Layout className="h-4 w-4 mr-2" />
                Layout
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveTab('settings')}
                className={cn(
                  "justify-start",
                  activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                )}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveTab('accessibility')}
                className={cn(
                  "justify-start",
                  activeTab === 'accessibility' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                )}
              >
                <Eye className="h-4 w-4 mr-2" />
                Accessibility
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveTab('performance')}
                className={cn(
                  "justify-start",
                  activeTab === 'performance' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                )}
              >
                <Zap className="h-4 w-4 mr-2" />
                Performance
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'layout' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Layout Options</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Layout Density</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'compact', label: 'Compact', icon: Grid },
                      { id: 'comfortable', label: 'Comfortable', icon: Columns },
                      { id: 'spacious', label: 'Spacious', icon: Rows }
                    ].map((layout) => {
                      const Icon = layout.icon;
                      return (
                        <Button
                          key={layout.id}
                          size="sm"
                          onClick={() => {
                            handleSettingsChange({ layout: layout.id as any });
                            onLayoutChange(layout.id);
                          }}
                          className={cn(
                            "flex flex-col items-center space-y-2 h-20",
                            mobileSettings.layout === layout.id 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-800 text-gray-300'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{layout.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Font Size</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'small', label: 'S' },
                      { id: 'medium', label: 'M' },
                      { id: 'large', label: 'L' },
                      { id: 'extra-large', label: 'XL' }
                    ].map((size) => (
                      <Button
                        key={size.id}
                        size="sm"
                        onClick={() => handleSettingsChange({ fontSize: size.id as any })}
                        className={cn(
                          "h-12",
                          mobileSettings.fontSize === size.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-300'
                        )}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'auto', label: 'Auto', icon: Palette }
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <Button
                          key={theme.id}
                          size="sm"
                          onClick={() => {
                            handleSettingsChange({ theme: theme.id as any });
                            onThemeChange(theme.id);
                          }}
                          className={cn(
                            "flex flex-col items-center space-y-2 h-16",
                            mobileSettings.theme === theme.id 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-800 text-gray-300'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs">{theme.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="sm"
                  onClick={toggleFullscreen}
                  className="bg-gray-800 text-gray-300 hover:bg-gray-700 h-12"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="bg-gray-800 text-gray-300 hover:bg-gray-700 h-12"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Touch Gestures</h4>
              <div className="space-y-3">
                {Object.entries(mobileSettings.gestures).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleSettingsChange({
                        gestures: { ...mobileSettings.gestures, [key]: !value }
                      })}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors",
                        value ? 'bg-blue-600' : 'bg-gray-600'
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform",
                        value ? 'translate-x-3' : 'translate-x-0'
                      )} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Device Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{deviceInfo.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolution:</span>
                  <span className="text-white">{deviceInfo.width} × {deviceInfo.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pixel Ratio:</span>
                  <span className="text-white">{deviceInfo.pixelRatio}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-white">{deviceInfo.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Touch Device:</span>
                  <span className="text-white">{deviceInfo.isTouchDevice ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Connection:</span>
                  <span className="text-white capitalize">{deviceInfo.connectionType}</span>
                </div>
                {deviceInfo.batteryLevel !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Battery:</span>
                    <span className="text-white">{deviceInfo.batteryLevel}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Accessibility Options</h4>
              <div className="space-y-3">
                {Object.entries(mobileSettings.accessibility).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleSettingsChange({
                        accessibility: { ...mobileSettings.accessibility, [key]: !value }
                      })}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors",
                        value ? 'bg-blue-600' : 'bg-gray-600'
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform",
                        value ? 'translate-x-3' : 'translate-x-0'
                      )} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Visual Aids</h4>
              <div className="space-y-3">
                <Button
                  size="sm"
                  className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700 justify-start"
                >
                  <ZoomIn className="h-4 w-4 mr-2" />
                  Increase Contrast
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700 justify-start"
                >
                  <Type className="h-4 w-4 mr-2" />
                  Large Text
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700 justify-start"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Screen Reader
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Performance Settings</h4>
              <div className="space-y-3">
                {Object.entries(mobileSettings.performance).map(([key, value]) => {
                  if (key === 'cacheSize') {
                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-300">Cache Size (MB)</span>
                          <span className="text-sm text-white">{value}</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="500"
                          value={value}
                          onChange={(e) => handleSettingsChange({
                            performance: { ...mobileSettings.performance, cacheSize: parseInt(e.target.value) }
                          })}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleSettingsChange({
                          performance: { ...mobileSettings.performance, [key]: !value }
                        })}
                        className={cn(
                          "w-12 h-6 rounded-full transition-colors",
                          value ? 'bg-blue-600' : 'bg-gray-600'
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 bg-white rounded-full transition-transform",
                          value ? 'translate-x-3' : 'translate-x-0'
                        )} />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">System Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Online:</span>
                  <span className={cn(
                    "flex items-center space-x-1",
                    deviceInfo.isOnline ? 'text-green-400' : 'text-red-400'
                  )}>
                    {deviceInfo.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    <span>{deviceInfo.isOnline ? 'Yes' : 'No'}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Keyboard:</span>
                  <span className={cn(
                    "flex items-center space-x-1",
                    isKeyboardVisible ? 'text-blue-400' : 'text-gray-400'
                  )}>
                    <Keyboard className="h-3 w-3" />
                    <span>{isKeyboardVisible ? 'Visible' : 'Hidden'}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fullscreen:</span>
                  <span className={cn(
                    "flex items-center space-x-1",
                    isFullscreen ? 'text-blue-400' : 'text-gray-400'
                  )}>
                    {isFullscreen ? <Maximize className="h-3 w-3" /> : <Minimize className="h-3 w-3" />}
                    <span>{isFullscreen ? 'Yes' : 'No'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="border-t border-gray-800 bg-gray-900 p-2">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white"
          >
            <Code className="h-5 w-5" />
            <span className="text-xs">Code</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white"
          >
            <Play className="h-5 w-5" />
            <span className="text-xs">Run</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white"
          >
            <Share className="h-5 w-5" />
            <span className="text-xs">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
