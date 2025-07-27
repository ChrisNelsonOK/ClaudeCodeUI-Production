# Claude Code Desktop Application

A modern, production-ready desktop application interface for Claude AI with advanced features including chat management, file processing, plugin system, and comprehensive accessibility support.

## 🚀 Features

### Core Functionality
- **Advanced Chat Interface**: Real-time streaming responses with markdown support and syntax highlighting
- **Conversation Management**: Persistent chat history with search, export, and organization
- **File Processing**: Upload and analyze images, documents (PDF, TXT, MD, DOCX) with text extraction
- **Plugin System**: Extensible plugin marketplace with MCP (Model Context Protocol) integration

### Advanced Features
- **Command Palette**: Quick access to all features via Ctrl+K
- **Keyboard Shortcuts**: Comprehensive keyboard navigation and shortcuts
- **Theme System**: Multiple beautiful themes with customization options
- **Performance Monitoring**: Built-in performance tracking and optimization
- **Error Boundaries**: Robust error handling with graceful recovery

### Accessibility & UX
- **Full Accessibility**: Screen reader support, keyboard navigation, high contrast mode
- **Responsive Design**: Works perfectly on all screen sizes
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Virtual Scrolling**: Optimized performance for large data sets
- **Offline Support**: Local storage with data persistence

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Markdown**: React Markdown with syntax highlighting
- **Performance**: React Window for virtualization
- **Storage**: LocalStorage with compression and versioning

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build:production

# Preview production build
npm run preview
```

## 🎯 Usage

### Basic Operations
- **Start New Chat**: Click "New Chat" or press `Ctrl+N`
- **Command Palette**: Press `Ctrl+K` to access all features quickly
- **Upload Files**: Drag & drop files onto Vision or Documents panels
- **Search**: Use `Ctrl+F` to focus search inputs
- **Settings**: Press `Ctrl+,` or click Settings in sidebar

### Keyboard Shortcuts
- `Ctrl+N` - New chat
- `Ctrl+K` - Command palette
- `Ctrl+,` - Settings
- `Ctrl+F` - Focus search
- `Shift+?` - Show help
- `Escape` - Close modals/panels

### File Processing
1. **Images**: Upload to Vision panel for AI analysis with configurable analysis modes
2. **Documents**: Upload PDFs, text files for content extraction and processing
3. **Batch Operations**: Process multiple files simultaneously

### Plugin Management
1. Browse the plugin marketplace
2. Install plugins with one click
3. Configure plugin settings
4. Connect to MCP servers for extended capabilities

## 🔧 Configuration

### Theme Customization
The application supports multiple themes accessible via Settings > Appearance:
- Dark Pro (default)
- Blue Night
- Crimson Dark
- Cyber Green

### Performance Tuning
- Virtual scrolling automatically handles large lists
- Bundle splitting optimizes loading times
- Memory monitoring alerts for high usage
- Automatic error recovery and logging

### Accessibility Options
- High contrast mode support
- Reduced motion preferences
- Screen reader announcements
- Keyboard-only navigation

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file for production configuration:
```env
VITE_APP_TITLE=Claude Code
VITE_API_URL=your-api-endpoint
VITE_ENVIRONMENT=production
```

### Performance Optimization
The build includes:
- Code splitting and lazy loading
- Asset optimization
- Bundle analysis
- Service worker for caching

## 🔐 Security Features

- XSS protection with input sanitization
- Content Security Policy implementation
- Secure local storage with encryption
- Rate limiting for API calls
- Error logging and monitoring

## 🧪 Development

### Code Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and themes
```

### Performance Monitoring
Development mode includes:
- Render time tracking
- Memory usage monitoring
- FPS measurement
- Bundle size analysis

### Error Handling
- React Error Boundaries
- Global error logging
- Graceful degradation
- User-friendly error messages

## 📊 Performance Metrics

The application tracks:
- **Page Load Time**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds  
- **Bundle Size**: < 1MB (gzipped)
- **Memory Usage**: < 100MB typical
- **Frame Rate**: 60 FPS maintained

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

### Development Setup
```bash
git clone <repository>
cd claude-code-app
npm install
npm run dev
```

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and support:
1. Check the error console for detailed error messages
2. Use the built-in error reporting
3. Refer to keyboard shortcuts with `Shift+?`
4. Contact support with error details

---

Built with ❤️ for the Claude AI community