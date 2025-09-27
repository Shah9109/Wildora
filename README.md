# Wildora - Wildlife Photography Community

A complete client-side Single Page Application (SPA) for wildlife photographers and nature enthusiasts. Built with vanilla HTML, CSS, and JavaScript with localStorage persistence.

## 🚀 Quick Start

### How to Run
1. Download or clone this project
2. Open `index.html` in any modern web browser
3. No server setup, build tools, or dependencies required!

### Demo Credentials
Use these pre-seeded accounts to explore the full functionality:

- **Demo Wilder**: `demo@aixawild.test` / `Demo@123`
- **Ranger Rita**: `user2@aixawild.test` / `Pass@123`
- **Alex Storm**: `alex@aixawild.test` / `Wild@123`
- **Maya Forest**: `maya@aixawild.test` / `Nature@123`
- **Sam Rivers**: `sam@aixawild.test` / `Photo@123`

## ✨ Features

### 🔐 Authentication System
- **Login/Signup Modals**: Secure authentication with form validation
- **Password Strength Checker**: Real-time password validation
- **Demo Accounts**: Pre-seeded users for immediate testing
- **Session Persistence**: Stay logged in across browser sessions

### 📸 Feed & Posts
- **Vertical Feed**: Infinite scroll of wildlife photography posts
- **Rich Media Support**: Images and videos with full-screen viewing
- **Interactive Actions**: Like, comment, and share posts
- **Post Modal**: Detailed view with comments, location map, and metadata
- **Real-time Updates**: Instant UI updates for all interactions

### 🗺️ Location Features
- **Interactive Map View**: Leaflet-powered map showing all post locations
- **GPS EXIF Extraction**: Automatic location detection from photo metadata
- **Manual Location Picker**: Click-to-select location on map
- **Location Display**: Beautiful location cards with place names

### 📤 Upload System
- **Drag & Drop Upload**: Intuitive file upload with preview
- **Media Preview**: Real-time preview before publishing
- **EXIF Location Extraction**: Automatic GPS data extraction from photos
- **Manual Location Selection**: Interactive map for location picking
- **Tag System**: Organize content with searchable tags

### 🗂️ Collections
- **Photo Gallery**: 100+ curated wildlife images
- **Video Gallery**: Professional wildlife videography
- **Search & Filter**: Find content by tags, species, or photographer
- **Lazy Loading**: Optimized performance with progressive loading
- **Collection to Post**: Convert gallery items to shareable posts

### 💬 Chat System
- **Real-time Messaging**: Instant communication with other users
- **Sliding Drawer**: Smooth right-slide chat interface
- **User List**: Browse and chat with community members
- **Message History**: Persistent chat history across sessions
- **Bot Responses**: Simulated replies for demonstration

### 🎨 Design & UX
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Modern UI**: Clean, rounded components with subtle shadows
- **Smooth Animations**: Fade, slide, and pulse effects
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Touch Gestures**: Swipe to open/close chat on mobile

## 🛠️ Technical Details

### Data Storage
All data is stored in browser localStorage with these keys:

- `wildora_users`: User accounts and profiles
- `wildora_currentUser`: Current session data
- `wildora_posts`: All posts with media, comments, and likes
- `wildora_chats`: Chat rooms and message history
- `wildora_assetsCollection`: Gallery images and videos

### Storage Limitations
- **File Size**: Large files are stored as object URLs (temporary)
- **Persistence**: Object URLs reset after page reload
- **Capacity**: localStorage limited to ~5-10MB per domain
- **Media**: Uses external URLs (Unsplash/Pexels) for demo content

### CDN Libraries Used
- **Leaflet 1.9.4**: Interactive maps and location services
- **EXIF.js 2.3.0**: GPS metadata extraction from images
- **Google Fonts**: Inter font family for modern typography

### Browser Compatibility
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Features Used**: ES6+, CSS Grid, Flexbox, localStorage, Geolocation API
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🎯 Key Features Breakdown

### Search & Discovery
- **Global Search**: Search across captions, tags, authors, and locations
- **Tag Filtering**: Click any tag to filter posts
- **Trending Tags**: See most popular tags in the community
- **Recent Activity**: Track likes and comments from other users

### Mobile Experience
- **Touch Optimized**: Swipe gestures and touch-friendly interface
- **Bottom Navigation**: Easy thumb navigation on mobile
- **Responsive Images**: Optimized loading for different screen sizes
- **Offline Ready**: Core functionality works without internet

### Performance Optimizations
- **Lazy Loading**: Images load as they enter viewport
- **Debounced Search**: Optimized search with 300ms delay
- **Memory Management**: Automatic cleanup of object URLs
- **Efficient Rendering**: Minimal DOM manipulation for smooth performance

## 🌟 Demo Content

### Seeded Posts
6 high-quality wildlife posts featuring:
- Mountain eagles in Utah
- Deer families in Yellowstone
- Lightning storms in Serengeti
- Sea turtles in Hawaii
- Hummingbirds in Costa Rica
- Polar bears in the Arctic

### Gallery Assets
- **100+ Images**: Curated wildlife photography from Unsplash
- **10+ Videos**: Sample wildlife videos for demonstration
- **Diverse Content**: Various species, habitats, and photography styles

## 🔧 Development Notes

### File Structure
```
wildora/
├── index.html          # Main application file
├── styles.css          # Complete styling and responsive design
├── app.js             # Full application logic and functionality
└── README.md          # This documentation
```

### Color Palette
Consistent brand colors defined as CSS variables:
- Primary Blue: `#1e85ff` (RGB 30,133,255)
- Secondary Blue: `#56a4ff` (RGB 86,164,255)
- Soft Accent: `#95c5ff` (RGB 149,197,255)
- Light Background: `#cce3ff` (RGB 204,227,255)
- Very Light: `#eff7ff` (RGB 239,247,255)

### Keyboard Shortcuts
- `H`: Home/Feed view
- `M`: Map view
- `C`: Collections view
- `U`: Upload modal (when logged in)
- `/`: Focus search bar
- `ESC`: Close modals/drawers

## 📱 Mobile Features

### Touch Gestures
- **Swipe Left**: Open chat drawer
- **Swipe Right**: Close chat drawer
- **Tap & Hold**: Additional context options
- **Pinch to Zoom**: Map navigation

### Responsive Breakpoints
- **Desktop**: 1024px+ (full sidebar layout)
- **Tablet**: 768px-1023px (two-column layout)
- **Mobile**: <768px (stacked layout with bottom nav)

## 🎨 Media Credits

All demo images and videos are sourced from:
- **Unsplash**: High-quality wildlife photography
- **Pexels**: Additional nature and wildlife content
- **Sample Videos**: Standard test videos for demonstration

## 🔒 Privacy & Security

- **Client-Side Only**: No data sent to external servers
- **Local Storage**: All data stays in your browser
- **No Tracking**: No analytics or tracking scripts
- **Secure Forms**: Input validation and sanitization

## 🚀 Future Enhancements

Potential improvements for production use:
- **Real Backend**: Database integration for persistent storage
- **File Upload**: Actual file storage and processing
- **Push Notifications**: Real-time chat notifications
- **PWA Features**: Offline support and app installation
- **Social Features**: Following, user profiles, and recommendations

## 📄 License

This project is created for demonstration purposes. Media assets are credited to their respective sources (Unsplash/Pexels).

---

**Wildora** - Connecting wildlife photographers and nature enthusiasts around the world. 🌍📸🦅