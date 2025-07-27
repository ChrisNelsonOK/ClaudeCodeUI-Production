import React, { useState } from 'react';
import { 
  Palette, 
  Globe, 
  Bell, 
  Lock, 
  Zap, 
  Moon, 
  Sun, 
  Volume2, 
  Keyboard,
  Download,
  Upload,
  Check
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';

const SettingsPanel: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { currentTheme, currentThemeId, themes, applyTheme } = useTheme();
  const { addNotification } = useApp();

  const handleThemeChange = (themeId: string) => {
    applyTheme(themeId);
    addNotification({
      type: 'success',
      title: 'Theme Changed',
      message: `Switched to ${themes[themeId].name} theme`,
      duration: 3000
    });
  };

  const languages = [
    'English (US)', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'
  ];

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Palette className="w-5 h-5 text-blue-400" />
          <span>Appearance</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
          
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`p-3 rounded-lg border transition-all duration-300 relative group ${
                    currentThemeId === theme.id
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                  }`}
                >
                  <div 
                    className="w-full h-6 rounded mb-2 relative overflow-hidden"
                    style={{ background: theme.colors.background.primary }}
                  >
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-20`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-300">{theme.name}</span>
                  {currentThemeId === theme.id && (
                    <div className="absolute top-1 right-1 text-blue-400">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ring-1 ring-blue-400/50"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Globe className="w-5 h-5 text-green-400" />
          <span>Language & Region</span>
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Language</label>
            <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Time Format</label>
            <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
              <option>12-hour</option>
              <option>24-hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          <span>Notifications</span>
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Enable notifications</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <div className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${
                notifications ? 'bg-blue-500' : 'bg-gray-600'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full ml-1 transform transition-transform duration-200 ${
                  notifications ? 'translate-x-4' : ''
                }`}></div>
              </div>
            </div>
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Sound notifications</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <div className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${
                soundEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full ml-1 transform transition-transform duration-200 ${
                  soundEnabled ? 'translate-x-4' : ''
                }`}></div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Keyboard className="w-5 h-5 text-purple-400" />
          <span>Keyboard Shortcuts</span>
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">New chat</span>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300">⌘ N</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Settings</span>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300">⌘ ,</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Clear chat</span>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300">⌘ K</kbd>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Lock className="w-5 h-5 text-red-400" />
          <span>Data Management</span>
        </h3>
        
        <div className="space-y-3">
          <button 
            onClick={() => addNotification({
              type: 'info',
              title: 'Export Started',
              message: 'Your data export has been initiated'
            })}
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          
          <button 
            onClick={() => addNotification({
              type: 'success',
              title: 'Import Ready',
              message: 'Select your data file to import'
            })}
            className="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-green-500/25"
          >
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
          </button>
          
          <button 
            onClick={() => addNotification({
              type: 'warning',
              title: 'Clear Data Warning',
              message: 'This action cannot be undone. Please confirm.'
            })}
            className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* Advanced */}
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-orange-400" />
          <span>Advanced</span>
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Hardware acceleration</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" defaultChecked />
              <div className="w-10 h-6 bg-blue-500 rounded-full flex items-center">
                <div className="w-4 h-4 bg-white rounded-full ml-1 transform translate-x-4 transition-transform duration-200"></div>
              </div>
            </div>
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Beta features</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="w-10 h-6 bg-gray-600 rounded-full flex items-center">
                <div className="w-4 h-4 bg-white rounded-full ml-1 transition-transform duration-200"></div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;