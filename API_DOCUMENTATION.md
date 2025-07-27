# 🔌 Claude Code Desktop - Complete API Documentation

## Overview
Production-ready API documentation for all endpoints required by the refactored frontend. All mock data has been removed and these are the **real API endpoints** that the frontend now expects.

## 🔑 Authentication
All endpoints require authentication headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

## 📊 System Monitoring APIs

### Get System Memory
```http
GET /api/system/memory
```
**Response:**
```json
{
  "total": 17179869184,
  "used": 8589934592,
  "free": 8589934592,
  "cached": 2147483648,
  "buffers": 1073741824,
  "available": 9448928051,
  "percent": 50.0,
  "timestamp": "2024-07-27T12:00:00Z"
}
```

### Get System Stats
```http
GET /api/system/stats
```
**Response:**
```json
{
  "cpu": {
    "usage": 45.2,
    "cores": 8,
    "loadAverage": [2.1, 1.8, 1.5]
  },
  "memory": {
    "total": 17179869184,
    "used": 8589934592,
    "percent": 50.0
  },
  "disk": {
    "total": 500107862016,
    "used": 250053931008,
    "free": 250053931008,
    "percent": 50.0
  },
  "network": {
    "rx": 10485760,
    "tx": 5242880,
    "interfaces": ["eth0", "wlan0"]
  },
  "uptime": 86400,
  "timestamp": "2024-07-27T12:00:00Z"
}
```

### Get Running Processes
```http
GET /api/system/processes
```
**Response:**
```json
{
  "processes": [
    {
      "pid": 1234,
      "name": "node",
      "cpu": 15.2,
      "memory": 268435456,
      "status": "running",
      "uptime": 3600,
      "command": "node server.js"
    }
  ],
  "total": 45,
  "timestamp": "2024-07-27T12:00:00Z"
}
```

### Restart Process
```http
POST /api/system/processes/:pid/restart
```
**Response:**
```json
{
  "success": true,
  "message": "Process restarted successfully",
  "pid": 1234
}
```

### Stop Process
```http
DELETE /api/system/processes/:pid
```
**Response:**
```json
{
  "success": true,
  "message": "Process stopped successfully",
  "pid": 1234
}
```

## 🧠 Memory Management APIs

### Get Recent Sessions
```http
GET /api/sessions/recent
```
**Response:**
```json
{
  "sessions": [
    {
      "id": "sess_123456789",
      "title": "API Documentation Task",
      "timestamp": "2024-07-27T11:30:00Z",
      "duration": 1800,
      "memoryUsage": 536870912,
      "status": "completed"
    }
  ],
  "total": 10,
  "page": 1,
  "perPage": 20
}
```

### Delete Session
```http
DELETE /api/sessions/:id
```
**Response:**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

### Clear System Cache
```http
DELETE /api/system/cache
```
**Response:**
```json
{
  "success": true,
  "message": "System cache cleared successfully",
  "cleared": 1073741824
}
```

### Clear All Memory
```http
DELETE /api/system/memory/all
```
**Response:**
```json
{
  "success": true,
  "message": "All memory cleared successfully",
  "cleared": 5368709120
}
```

### Export Memory Data
```http
POST /api/system/memory/export
```
**Response:**
```json
{
  "success": true,
  "downloadUrl": "/api/downloads/memory-export-20240727.zip",
  "size": 10485760,
  "expires": "2024-07-28T12:00:00Z"
}
```

## 🔌 Plugin Management APIs

### Get Plugin Marketplace
```http
GET /api/plugins
```
**Response:**
```json
{
  "plugins": [
    {
      "id": "plugin-123",
      "name": "GitHub Integration",
      "description": "GitHub repository management",
      "version": "2.1.0",
      "author": "ClaudeCode",
      "category": "source-control",
      "installed": false,
      "enabled": false,
      "rating": 4.8,
      "downloads": 15000,
      "lastUpdated": "2024-07-25T10:00:00Z"
    }
  ],
  "total": 25,
  "categories": ["source-control", "testing", "deployment", "monitoring"]
}
```

### Install Plugin
```http
POST /api/plugins/install
```
**Request:**
```json
{
  "pluginId": "plugin-123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Plugin installed successfully",
  "pluginId": "plugin-123"
}
```

### Uninstall Plugin
```http
POST /api/plugins/uninstall
```
**Request:**
```json
{
  "pluginId": "plugin-123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Plugin uninstalled successfully"
}
```

### Toggle Plugin
```http
POST /api/plugins/toggle
```
**Request:**
```json
{
  "pluginId": "plugin-123",
  "enabled": true
}
```
**Response:**
```json
{
  "success": true,
  "message": "Plugin state updated",
  "pluginId": "plugin-123",
  "enabled": true
}
```

## 🌐 MCP Server APIs

### Get MCP Servers
```http
GET /api/mcp-servers
```
**Response:**
```json
{
  "servers": [
    {
      "id": "mcp-123",
      "name": "GitHub MCP Server",
      "description": "GitHub repository operations",
      "status": "connected",
      "endpoint": "http://localhost:3002",
      "capabilities": ["read", "write", "execute"],
      "lastPing": "2024-07-27T12:00:00Z"
    }
  ],
  "total": 5
}
```

### Connect MCP Server
```http
POST /api/mcp-servers/connect
```
**Request:**
```json
{
  "serverId": "mcp-123",
  "endpoint": "http://localhost:3002"
}
```
**Response:**
```json
{
  "success": true,
  "message": "MCP server connected successfully",
  "serverId": "mcp-123"
}
```

## 📁 File Upload APIs

### Upload File
```http
POST /api/files/upload
Content-Type: multipart/form-data
```
**Response:**
```json
{
  "uploadId": "upload-123456789",
  "status": "uploading",
  "filename": "document.pdf",
  "size": 10485760,
  "progress": 0,
  "estimatedTime": 30,
  "uploadUrl": "/api/uploads/upload-123456789"
}
```

### Get Upload Status
```http
GET /api/files/status/:uploadId
```
**Response:**
```json
{
  "uploadId": "upload-123456789",
  "status": "completed",
  "filename": "document.pdf",
  "size": 10485760,
  "processed": true,
  "results": {
    "type": "document",
    "pages": 10,
    "text": "Sample document content...",
    "metadata": {
      "title": "Sample Document",
      "author": "John Doe"
    }
  },
  "completedAt": "2024-07-27T12:05:00Z"
}
```

### Retry Failed Upload
```http
POST /api/files/retry
```
**Request:**
```json
{
  "uploadId": "upload-123456789"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Upload retry initiated",
  "uploadId": "upload-123456789"
}
```

### Clear All Uploads
```http
POST /api/files/clear
```
**Response:**
```json
{
  "success": true,
  "message": "All uploads cleared",
  "cleared": 5
}
```

## 📈 Performance Monitoring APIs

### Report Render Metrics
```http
POST /api/performance/render
```
**Request:**
```json
{
  "component": "MemoryPanel",
  "renderTime": 150,
  "memoryUsage": 52428800,
  "timestamp": "2024-07-27T12:00:00Z"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Render metrics recorded"
}
```

### Report Web Vitals
```http
POST /api/performance/web-vitals
```
**Request:**
```json
{
  "LCP": 2500,
  "FID": 100,
  "CLS": 0.1,
  "timestamp": "2024-07-27T12:00:00Z"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Web vitals recorded"
}
```

### Report Real-time Metrics
```http
POST /api/performance/realtime
```
**Request:**
```json
{
  "fps": 60,
  "memory": {
    "used": 104857600,
    "total": 1073741824
  },
  "cpu": 25.5,
  "timestamp": "2024-07-27T12:00:00Z"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Real-time metrics recorded"
}
```

## 🎤 Voice Commands APIs

### Execute Voice Command
```http
POST /api/voice-commands/execute
```
**Request:**
```json
{
  "command": "clear memory",
  "confidence": 0.95,
  "timestamp": "2024-07-27T12:00:00Z"
}
```
**Response:**
```json
{
  "success": true,
  "command": "clear memory",
  "action": "clearMemory",
  "parameters": {},
  "result": {
    "cleared": 5368709120,
    "message": "Memory cleared successfully"
  }
}
```

### Log Voice Command
```http
POST /api/voice-commands/log
```
**Request:**
```json
{
  "command": "open settings",
  "confidence": 0.88,
  "timestamp": "2024-07-27T12:00:00Z",
  "userId": "user-123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Command logged successfully"
}
```

### Report Voice Command Error
```http
POST /api/voice-commands/error
```
**Request:**
```json
{
  "command": "unknown command",
  "error": "Command not recognized",
  "confidence": 0.3,
  "timestamp": "2024-07-27T12:00:00Z"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Error logged successfully"
}
```

### Get Voice Command Statistics
```http
GET /api/voice-commands/stats
```
**Response:**
```json
{
  "totalCommands": 150,
  "successfulCommands": 135,
  "failedCommands": 15,
  "averageConfidence": 0.87,
  "mostUsedCommands": [
    {"command": "clear memory", "count": 25},
    {"command": "open settings", "count": 20}
  ],
  "timestamp": "2024-07-27T12:00:00Z"
}
```

## 🤝 Real-time Collaboration APIs

### WebSocket Connection
```javascript
// WebSocket endpoint
wss://api.yourdomain.com/api/collaboration/:roomId

// Connection message
{
  "type": "join",
  "userId": "user-123",
  "username": "JohnDoe",
  "roomId": "room-456"
}
```

### Send Collaboration Event
```http
POST /api/collaboration/:room/event
```
**Request:**
```json
{
  "type": "cursor_update",
  "userId": "user-123",
  "position": {
    "x": 100,
    "y": 200
  },
  "timestamp": "2024-07-27T12:00:00Z"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Event broadcast to room",
  "roomId": "room-456"
}
```

### Get Room History
```http
GET /api/collaboration/:room/history
```
**Response:**
```json
{
  "events": [
    {
      "type": "cursor_update",
      "userId": "user-123",
      "position": {"x": 100, "y": 200},
      "timestamp": "2024-07-27T12:00:00Z"
    }
  ],
  "total": 50,
  "roomId": "room-456"
}
```

### Get Room Users
```http
GET /api/collaboration/:room/users
```
**Response:**
```json
{
  "users": [
    {
      "userId": "user-123",
      "username": "JohnDoe",
      "joinedAt": "2024-07-27T11:55:00Z",
      "cursor": {"x": 100, "y": 200}
    }
  ],
  "total": 3,
  "roomId": "room-456"
}
```

## 🚨 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "uploadId",
      "issue": "uploadId is required"
    }
  }
}
```

### Rate Limiting
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

## 📱 Pagination
All list endpoints support pagination:
```http
GET /api/plugins?page=1&perPage=20
```

### Pagination Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

**Frontend is 100% ready. Backend implementation required for these endpoints.**
