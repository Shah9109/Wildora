// Wildora - Wildlife Photography Community SPA
// Complete client-side application with localStorage persistence

// Global variables
let currentUser = null;
let currentPostId = null;
let currentChatPartner = null;
let map = null;
let uploadMap = null;
let postModalMap = null;
let selectedLocation = null;
let uploadFile = null;

// LocalStorage wrapper functions
function save(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function read(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadCurrentUser();
    initializeSeedData();
    showFeed();
});

function initializeApp() {
    // Initialize any required app state
    console.log('Wildora app initialized');
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', debounce(performSearch, 300));
    document.getElementById('collectionSearch').addEventListener('input', debounce(searchCollections, 300));
    
    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('signupPassword').addEventListener('input', checkPasswordStrength);
    
    // Upload form
    document.getElementById('uploadForm').addEventListener('submit', handleUpload);
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    document.getElementById('uploadCaption').addEventListener('input', validateUploadForm);
    
    // Chat input
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Comment input
    document.getElementById('commentInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addComment(currentPostId);
        }
    });
    
    // Modal close on overlay click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // File drag and drop
    const fileUpload = document.getElementById('fileUpload');
    fileUpload.addEventListener('dragover', handleDragOver);
    fileUpload.addEventListener('drop', handleFileDrop);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return new Date(date).toLocaleDateString();
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Authentication System
function initializeSeedData() {
    // Initialize users if not exists
    let users = read('wildora_users', []);
    if (users.length === 0) {
        users = [
            {
                id: 'user1',
                email: 'demo@aixawild.test',
                password: 'Demo@123',
                displayName: 'Demo Wilder',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                bio: 'Wildlife photographer and nature enthusiast. Capturing the beauty of the wild one shot at a time.'
            },
            {
                id: 'user2',
                email: 'user2@aixawild.test',
                password: 'Pass@123',
                displayName: 'Ranger Rita',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                bio: 'Park ranger and conservation advocate. Protecting wildlife habitats across national parks.'
            },
            {
                id: 'user3',
                email: 'alex@aixawild.test',
                password: 'Wild@123',
                displayName: 'Alex Storm',
                avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                bio: 'Adventure photographer specializing in extreme weather wildlife photography.'
            },
            {
                id: 'user4',
                email: 'maya@aixawild.test',
                password: 'Nature@123',
                displayName: 'Maya Forest',
                avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                bio: 'Marine biologist and underwater photographer documenting ocean wildlife.'
            },
            {
                id: 'user5',
                email: 'sam@aixawild.test',
                password: 'Photo@123',
                displayName: 'Sam Rivers',
                avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                bio: 'Bird photographer and ornithologist. Capturing the beauty of avian species worldwide.'
            }
        ];
        save('wildora_users', users);
    }
    
    // Initialize posts if not exists
    let posts = read('wildora_posts', []);
    if (posts.length === 0) {
        posts = [
            {
                id: 'post1',
                authorId: 'user1',
                mediaUrl: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=600&fit=crop',
                mediaType: 'image',
                caption: 'Majestic eagle soaring through the mountain peaks. The power and grace of these magnificent birds never ceases to amaze me.',
                tags: ['eagle', 'mountains', 'wildlife', 'birds', 'nature'],
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                location: {
                    lat: 40.7589,
                    lng: -111.8883,
                    placeName: 'Wasatch Mountains, Utah'
                },
                likes: ['user2', 'user3', 'user4'],
                comments: [
                    {
                        id: 'comment1',
                        authorId: 'user2',
                        text: 'Absolutely stunning capture! The detail in the feathers is incredible.',
                        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 'comment2',
                        authorId: 'user3',
                        text: 'This is why I love wildlife photography. Pure majesty!',
                        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 'post2',
                authorId: 'user2',
                mediaUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop',
                mediaType: 'image',
                caption: 'A family of deer grazing peacefully in the early morning mist. These quiet moments remind us of the serenity found in nature.',
                tags: ['deer', 'morning', 'mist', 'family', 'peaceful'],
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                location: {
                    lat: 44.4280,
                    lng: -110.5885,
                    placeName: 'Yellowstone National Park'
                },
                likes: ['user1', 'user4', 'user5'],
                comments: [
                    {
                        id: 'comment3',
                        authorId: 'user1',
                        text: 'The mist adds such a magical quality to this shot!',
                        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 'post3',
                authorId: 'user3',
                mediaUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                mediaType: 'video',
                caption: 'Lightning storm over the savanna - nature\'s most powerful display. Captured this incredible moment during our expedition.',
                tags: ['lightning', 'storm', 'savanna', 'weather', 'dramatic'],
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                location: {
                    lat: -2.1540,
                    lng: 34.6857,
                    placeName: 'Serengeti National Park, Tanzania'
                },
                likes: ['user1', 'user2', 'user5'],
                comments: []
            },
            {
                id: 'post4',
                authorId: 'user4',
                mediaUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
                mediaType: 'image',
                caption: 'Underwater ballet - a sea turtle gracefully gliding through crystal clear waters. The ocean holds so many wonders.',
                tags: ['turtle', 'underwater', 'ocean', 'marine', 'graceful'],
                createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                location: {
                    lat: 21.3099,
                    lng: -157.8581,
                    placeName: 'Hanauma Bay, Hawaii'
                },
                likes: ['user1', 'user2', 'user3'],
                comments: [
                    {
                        id: 'comment4',
                        authorId: 'user5',
                        text: 'Marine photography at its finest! How deep were you when you took this?',
                        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 'post5',
                authorId: 'user5',
                mediaUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
                mediaType: 'image',
                caption: 'Colorful hummingbird feeding on nectar. These tiny jewels of the sky can beat their wings up to 80 times per second!',
                tags: ['hummingbird', 'colorful', 'nectar', 'tiny', 'fast'],
                createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                location: {
                    lat: 9.7489,
                    lng: -83.7534,
                    placeName: 'Costa Rica Rainforest'
                },
                likes: ['user2', 'user3', 'user4'],
                comments: [
                    {
                        id: 'comment5',
                        authorId: 'user1',
                        text: 'The colors are absolutely vibrant! What camera settings did you use?',
                        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 'post6',
                authorId: 'user1',
                mediaUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
                mediaType: 'image',
                caption: 'Polar bear mother with her cubs on the Arctic ice. Climate change makes moments like these increasingly precious.',
                tags: ['polar bear', 'cubs', 'arctic', 'ice', 'climate'],
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                location: {
                    lat: 74.5000,
                    lng: -109.0000,
                    placeName: 'Arctic Ocean, Canada'
                },
                likes: ['user2', 'user3', 'user4', 'user5'],
                comments: [
                    {
                        id: 'comment6',
                        authorId: 'user2',
                        text: 'Heartbreaking and beautiful at the same time. We must protect their habitat.',
                        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
                    }
                ]
            }
        ];
        save('wildora_posts', posts);
    }
    
    // Initialize assets collection
    let assetsCollection = read('wildora_assetsCollection', {});
    if (!assetsCollection.images || assetsCollection.images.length === 0) {
        assetsCollection = {
            images: [
                'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
            ],
            videos: [
                'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4'
            ]
        };
        
        // Generate more images
        const baseImages = [
            'photo-1549366021-9f761d040a94', 'photo-1564349683136-77e08dba1ef7',
            'photo-1559827260-dc66d52bef19', 'photo-1552728089-57bdde30beb3',
            'photo-1551650975-87deedd944c3', 'photo-1546026423-cc4642628d2b',
            'photo-1558618666-fcd25c85cd64', 'photo-1571068316344-75bc76f77890',
            'photo-1583212292454-1fe6229603b7', 'photo-1564760055775-d63b17a55c44'
        ];
        
        for (let i = 0; i < 100; i++) {
            const randomImage = baseImages[Math.floor(Math.random() * baseImages.length)];
            const randomSeed = Math.floor(Math.random() * 1000);
            assetsCollection.images.push(`https://images.unsplash.com/${randomImage}?w=400&h=300&fit=crop&seed=${randomSeed}`);
        }
        
        save('wildora_assetsCollection', assetsCollection);
    }
    
    // Initialize chats
    let chats = read('wildora_chats', {});
    if (Object.keys(chats).length === 0) {
        chats = {
            'user1-user2': {
                roomId: 'user1-user2',
                participants: ['user1', 'user2'],
                messages: [
                    {
                        id: 'msg1',
                        senderId: 'user2',
                        text: 'Amazing eagle shot! Where did you capture that?',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 'msg2',
                        senderId: 'user1',
                        text: 'Thanks! It was in the Wasatch Mountains. The lighting was perfect that morning.',
                        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            'user1-user3': {
                roomId: 'user1-user3',
                participants: ['user1', 'user3'],
                messages: [
                    {
                        id: 'msg3',
                        senderId: 'user3',
                        text: 'Hey! Loved your polar bear shots. Any tips for extreme weather photography?',
                        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
                    }
                ]
            }
        };
        save('wildora_chats', chats);
    }
}

function loadCurrentUser() {
    currentUser = read('wildora_currentUser');
    updateUserInterface();
}

function updateUserInterface() {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        userAvatar.src = currentUser.avatarUrl;
        userName.textContent = currentUser.displayName;
    } else {
        loginBtn.style.display = 'block';
        userProfile.style.display = 'none';
    }
}

function showLoginModal() {
    showModal('loginModal');
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
}

function showSignupForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = read('wildora_users', []);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        save('wildora_currentUser', currentUser);
        updateUserInterface();
        closeModal('loginModal');
        showNotification('Welcome back, ' + user.displayName + '!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const bio = document.getElementById('signupBio').value;
    
    const users = read('wildora_users', []);
    
    if (users.find(u => u.email === email)) {
        showNotification('Email already exists', 'error');
        return;
    }
    
    if (!isValidPassword(password)) {
        showNotification('Password must be at least 8 characters with uppercase, lowercase, and number', 'error');
        return;
    }
    
    const newUser = {
        id: generateId(),
        email,
        password,
        displayName: name,
        avatarUrl: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&seed=${Math.random()}`,
        bio: bio || 'Wildlife enthusiast and photographer'
    };
    
    users.push(newUser);
    save('wildora_users', users);
    
    currentUser = newUser;
    save('wildora_currentUser', currentUser);
    updateUserInterface();
    closeModal('loginModal');
    showNotification('Welcome to Wildora, ' + name + '!', 'success');
}

function checkPasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const strengthDiv = document.getElementById('passwordStrength');
    
    if (password.length === 0) {
        strengthDiv.textContent = '';
        return;
    }
    
    if (isValidPassword(password)) {
        strengthDiv.textContent = 'Strong password';
        strengthDiv.className = 'password-strength strong';
    } else if (password.length >= 6) {
        strengthDiv.textContent = 'Medium strength - add uppercase, lowercase, and numbers';
        strengthDiv.className = 'password-strength medium';
    } else {
        strengthDiv.textContent = 'Weak password - too short';
        strengthDiv.className = 'password-strength weak';
    }
}

function isValidPassword(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('wildora_currentUser');
    updateUserInterface();
    showNotification('Logged out successfully', 'success');
}

// Feed System
function showFeed() {
    hideAllViews();
    document.getElementById('feedView').classList.add('active');
    loadFeed();
    updateActiveNav('feed');
}

function loadFeed() {
    const posts = read('wildora_posts', []);
    const users = read('wildora_users', []);
    const feedContainer = document.getElementById('feed');
    
    // Sort posts by creation date (newest first)
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    feedContainer.innerHTML = '';
    
    posts.forEach(post => {
        const author = users.find(u => u.id === post.authorId);
        if (!author) return;
        
        const postElement = createPostElement(post, author);
        feedContainer.appendChild(postElement);
    });
    
    loadTrendingTags();
    loadRecentActivity();
}

function createPostElement(post, author) {
    const isLiked = currentUser && post.likes.includes(currentUser.id);
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.innerHTML = `
        <div class="post-header">
            <img src="${author.avatarUrl}" alt="${author.displayName}" class="author-avatar">
            <div class="author-info">
                <h4>${author.displayName}</h4>
                <span class="timestamp">${formatTimeAgo(post.createdAt)}</span>
            </div>
        </div>
        
        ${post.mediaType === 'video' ? 
            `<video src="${post.mediaUrl}" class="post-media" controls onclick="openPostModal('${post.id}')"></video>` :
            `<img src="${post.mediaUrl}" alt="Post media" class="post-media" onclick="openPostModal('${post.id}')">`
        }
        
        <div class="post-content">
            <p class="post-caption">${post.caption}</p>
            <div class="post-tags">
                ${post.tags.map(tag => `<a href="#" class="tag" onclick="filterByTag('${tag}')">#${tag}</a>`).join('')}
            </div>
            <div class="post-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${post.location.placeName}</span>
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>${post.likes.length}</span>
                </button>
                <button class="action-btn" onclick="openPostModal('${post.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>${post.comments.length}</span>
                </button>
                <button class="action-btn" onclick="sharePost('${post.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                </button>
            </div>
        </div>
    `;
    
    return postDiv;
}

function toggleLike(postId) {
    if (!currentUser) {
        showNotification('Please login to like posts', 'error');
        return;
    }
    
    const posts = read('wildora_posts', []);
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    const likeIndex = post.likes.indexOf(currentUser.id);
    if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
    } else {
        post.likes.push(currentUser.id);
    }
    
    save('wildora_posts', posts);
    loadFeed(); // Refresh feed to show updated likes
    
    // Update post modal if open
    if (currentPostId === postId) {
        updatePostModalLikes(post);
    }
}

function sharePost(postId) {
    const url = `${window.location.origin}${window.location.pathname}#post=${postId}`;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Post link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Could not copy link', 'error');
    });
}

function openPostModal(postId) {
    const posts = read('wildora_posts', []);
    const users = read('wildora_users', []);
    const post = posts.find(p => p.id === postId);
    const author = users.find(u => u.id === post.authorId);
    
    if (!post || !author) return;
    
    currentPostId = postId;
    
    // Update modal content
    const modal = document.getElementById('postModal');
    const mediaImg = document.getElementById('postModalMedia');
    const mediaVideo = document.getElementById('postModalVideo');
    
    if (post.mediaType === 'video') {
        mediaImg.style.display = 'none';
        mediaVideo.style.display = 'block';
        mediaVideo.src = post.mediaUrl;
    } else {
        mediaVideo.style.display = 'none';
        mediaImg.style.display = 'block';
        mediaImg.src = post.mediaUrl;
    }
    
    document.getElementById('postModalAuthorAvatar').src = author.avatarUrl;
    document.getElementById('postModalAuthorName').textContent = author.displayName;
    document.getElementById('postModalTimestamp').textContent = formatTimeAgo(post.createdAt);
    document.getElementById('postModalCaption').textContent = post.caption;
    document.getElementById('postModalLocationName').textContent = post.location.placeName;
    
    // Update tags
    const tagsContainer = document.getElementById('postModalTags');
    tagsContainer.innerHTML = post.tags.map(tag => 
        `<a href="#" class="tag" onclick="filterByTag('${tag}')">#${tag}</a>`
    ).join('');
    
    // Update likes
    updatePostModalLikes(post);
    
    // Load comments
    loadPostComments(post);
    
    // Initialize mini map
    setTimeout(() => {
        initPostModalMap(post.location);
    }, 100);
    
    showModal('postModal');
}

function updatePostModalLikes(post) {
    const isLiked = currentUser && post.likes.includes(currentUser.id);
    const likeBtn = document.getElementById('postModalLikeBtn');
    const likeCount = document.getElementById('postModalLikeCount');
    
    likeBtn.className = `action-btn like-btn ${isLiked ? 'liked' : ''}`;
    likeBtn.querySelector('svg').setAttribute('fill', isLiked ? 'currentColor' : 'none');
    likeCount.textContent = post.likes.length;
}

function loadPostComments(post) {
    const users = read('wildora_users', []);
    const commentsContainer = document.getElementById('postModalComments');
    
    commentsContainer.innerHTML = post.comments.map(comment => {
        const commentAuthor = users.find(u => u.id === comment.authorId);
        if (!commentAuthor) return '';
        
        return `
            <div class="comment">
                <img src="${commentAuthor.avatarUrl}" alt="${commentAuthor.displayName}" class="comment-avatar">
                <div class="comment-content">
                    <div class="comment-author">${commentAuthor.displayName}</div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-time">${formatTimeAgo(comment.createdAt)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function addComment(postId) {
    if (!currentUser) {
        showNotification('Please login to comment', 'error');
        return;
    }
    
    const commentInput = document.getElementById('commentInput');
    const text = commentInput.value.trim();
    
    if (!text) return;
    
    const posts = read('wildora_posts', []);
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    const newComment = {
        id: generateId(),
        authorId: currentUser.id,
        text: text,
        createdAt: new Date().toISOString()
    };
    
    post.comments.push(newComment);
    save('wildora_posts', posts);
    
    commentInput.value = '';
    loadPostComments(post);
    loadFeed(); // Refresh feed to show updated comment count
}

function initPostModalMap(location) {
    if (postModalMap) {
        postModalMap.remove();
    }
    
    const mapContainer = document.getElementById('postModalMap');
    if (!mapContainer) return;
    
    postModalMap = L.map(mapContainer).setView([location.lat, location.lng], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(postModalMap);
    
    L.marker([location.lat, location.lng])
        .addTo(postModalMap)
        .bindPopup(location.placeName);
}

function loadTrendingTags() {
    const posts = read('wildora_posts', []);
    const tagCounts = {};
    
    posts.forEach(post => {
        post.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    
    const sortedTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    const container = document.getElementById('trendingTags');
    container.innerHTML = sortedTags.map(([tag, count]) => `
        <div class="trending-tag" onclick="filterByTag('${tag}')">
            <span class="trending-tag-name">#${tag}</span>
            <span class="trending-tag-count">${count}</span>
        </div>
    `).join('');
}

function loadRecentActivity() {
    const posts = read('wildora_posts', []);
    const users = read('wildora_users', []);
    
    // Get recent likes and comments
    const activities = [];
    
    posts.forEach(post => {
        const author = users.find(u => u.id === post.authorId);
        if (!author) return;
        
        // Recent likes
        post.likes.slice(-3).forEach(userId => {
            const user = users.find(u => u.id === userId);
            if (user) {
                activities.push({
                    type: 'like',
                    user: user,
                    post: post,
                    timestamp: post.createdAt
                });
            }
        });
        
        // Recent comments
        post.comments.slice(-2).forEach(comment => {
            const user = users.find(u => u.id === comment.authorId);
            if (user) {
                activities.push({
                    type: 'comment',
                    user: user,
                    post: post,
                    timestamp: comment.createdAt
                });
            }
        });
    });
    
    // Sort by timestamp and take recent ones
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentActivities = activities.slice(0, 5);
    
    const container = document.getElementById('recentActivity');
    container.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <img src="${activity.user.avatarUrl}" alt="${activity.user.displayName}" class="activity-avatar">
            <div class="activity-text">
                <strong>${activity.user.displayName}</strong> 
                ${activity.type === 'like' ? 'liked' : 'commented on'} a post
            </div>
        </div>
    `).join('');
}

function filterByTag(tag) {
    const posts = read('wildora_posts', []);
    const users = read('wildora_users', []);
    const filteredPosts = posts.filter(post => post.tags.includes(tag));
    
    const feedContainer = document.getElementById('feed');
    feedContainer.innerHTML = '';
    
    filteredPosts.forEach(post => {
        const author = users.find(u => u.id === post.authorId);
        if (author) {
            const postElement = createPostElement(post, author);
            feedContainer.appendChild(postElement);
        }
    });
    
    // Add filter tag
    const filterTags = document.getElementById('filterTags');
    if (!filterTags.querySelector(`[data-tag="${tag}"]`)) {
        const filterTag = document.createElement('button');
        filterTag.className = 'filter-tag active';
        filterTag.setAttribute('data-tag', tag);
        filterTag.textContent = `#${tag}`;
        filterTag.onclick = () => removeFilter(tag);
        filterTags.appendChild(filterTag);
    }
}

function removeFilter(tag) {
    const filterTag = document.querySelector(`[data-tag="${tag}"]`);
    if (filterTag) {
        filterTag.remove();
    }
    
    // If no more filters, show all posts
    const remainingFilters = document.querySelectorAll('.filter-tag');
    if (remainingFilters.length === 0) {
        loadFeed();
    }
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!query) {
        loadFeed();
        return;
    }
    
    const posts = read('wildora_posts', []);
    const users = read('wildora_users', []);
    
    const filteredPosts = posts.filter(post => {
        const author = users.find(u => u.id === post.authorId);
        return post.caption.toLowerCase().includes(query) ||
               post.tags.some(tag => tag.toLowerCase().includes(query)) ||
               (author && author.displayName.toLowerCase().includes(query)) ||
               post.location.placeName.toLowerCase().includes(query);
    });
    
    const feedContainer = document.getElementById('feed');
    feedContainer.innerHTML = '';
    
    if (filteredPosts.length === 0) {
        feedContainer.innerHTML = '<p style="text-align: center; color: var(--grey-500); padding: 2rem;">No posts found matching your search.</p>';
        return;
    }
    
    filteredPosts.forEach(post => {
        const author = users.find(u => u.id === post.authorId);
        if (author) {
            const postElement = createPostElement(post, author);
            feedContainer.appendChild(postElement);
        }
    });
}

// Upload System
function showUploadModal() {
    if (!currentUser) {
        showNotification('Please login to upload', 'error');
        return;
    }
    
    resetUploadForm();
    showModal('uploadModal');
}

function resetUploadForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('fileUpload').style.display = 'block';
    document.getElementById('selectedLocation').style.display = 'none';
    document.getElementById('locationPicker').style.display = 'none';
    document.getElementById('publishBtn').disabled = true;
    uploadFile = null;
    selectedLocation = null;
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    uploadFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('filePreview');
        const upload = document.getElementById('fileUpload');
        const previewImage = document.getElementById('previewImage');
        const previewVideo = document.getElementById('previewVideo');
        
        upload.style.display = 'none';
        preview.style.display = 'block';
        
        if (file.type.startsWith('image/')) {
            previewImage.style.display = 'block';
            previewVideo.style.display = 'none';
            previewImage.src = e.target.result;
            
            // Try to extract EXIF location data
            EXIF.getData(file, function() {
                const lat = EXIF.getTag(this, "GPSLatitude");
                const lon = EXIF.getTag(this, "GPSLongitude");
                const latRef = EXIF.getTag(this, "GPSLatitudeRef");
                const lonRef = EXIF.getTag(this, "GPSLongitudeRef");
                
                if (lat && lon) {
                    const latitude = convertDMSToDD(lat, latRef);
                    const longitude = convertDMSToDD(lon, lonRef);
                    
                    selectedLocation = {
                        lat: latitude,
                        lng: longitude,
                        placeName: 'Location from photo'
                    };
                    
                    updateLocationDisplay();
                    validateUploadForm();
                }
            });
        } else if (file.type.startsWith('video/')) {
            previewVideo.style.display = 'block';
            previewImage.style.display = 'none';
            previewVideo.src = e.target.result;
        }
        
        validateUploadForm();
    };
    
    reader.readAsDataURL(file);
}

function convertDMSToDD(dms, ref) {
    let dd = dms[0] + dms[1]/60 + dms[2]/3600;
    if (ref === "S" || ref === "W") dd = dd * -1;
    return dd;
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.style.borderColor = 'var(--primary-blue)';
}

function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.style.borderColor = 'var(--grey-300)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('fileInput').files = files;
        handleFileSelect({ target: { files: files } });
    }
}

function removeFile() {
    resetUploadForm();
}

function detectLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by this browser', 'error');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            selectedLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                placeName: 'Current location'
            };
            updateLocationDisplay();
            validateUploadForm();
        },
        function(error) {
            showNotification('Could not get your location: ' + error.message, 'error');
        }
    );
}

function showLocationPicker() {
    const picker = document.getElementById('locationPicker');
    picker.style.display = 'block';
    
    setTimeout(() => {
        if (uploadMap) {
            uploadMap.remove();
        }
        
        uploadMap = L.map('uploadMap').setView([40.7589, -111.8883], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(uploadMap);
        
        let marker = null;
        
        uploadMap.on('click', function(e) {
            if (marker) {
                uploadMap.removeLayer(marker);
            }
            
            marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(uploadMap);
            
            selectedLocation = {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                placeName: `Location (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`
            };
            
            updateLocationDisplay();
            validateUploadForm();
        });
    }, 100);
}

function updateLocationDisplay() {
    const display = document.getElementById('selectedLocation');
    const locationText = document.getElementById('locationDisplay');
    
    if (selectedLocation) {
        display.style.display = 'flex';
        locationText.textContent = selectedLocation.placeName;
    } else {
        display.style.display = 'none';
    }
}

function clearLocation() {
    selectedLocation = null;
    updateLocationDisplay();
    validateUploadForm();
}

function validateUploadForm() {
    const publishBtn = document.getElementById('publishBtn');
    const hasFile = uploadFile !== null;
    const hasLocation = selectedLocation !== null;
    
    publishBtn.disabled = !(hasFile && hasLocation);
}

function handleUpload(e) {
    e.preventDefault();
    
    if (!uploadFile || !selectedLocation) {
        showNotification('Please select a file and location', 'error');
        return;
    }
    
    const caption = document.getElementById('uploadCaption').value.trim();
    const tagsInput = document.getElementById('uploadTags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim().toLowerCase()) : [];
    
    // Create object URL for the file (note: this will be lost on page reload)
    const mediaUrl = URL.createObjectURL(uploadFile);
    const mediaType = uploadFile.type.startsWith('image/') ? 'image' : 'video';
    
    const newPost = {
        id: generateId(),
        authorId: currentUser.id,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        caption: caption || 'New sighting',
        tags: tags,
        createdAt: new Date().toISOString(),
        location: selectedLocation,
        likes: [],
        comments: []
    };
    
    const posts = read('wildora_posts', []);
    posts.unshift(newPost); // Add to beginning
    save('wildora_posts', posts);
    
    closeModal('uploadModal');
    showFeed();
    showNotification('Sighting published successfully!', 'success');
}

// Map View
function showMap() {
    hideAllViews();
    document.getElementById('mapView').classList.add('active');
    updateActiveNav('map');
    
    setTimeout(() => {
        initializeMap();
    }, 100);
}

function initializeMap() {
    if (map) {
        map.remove();
    }
    
    map = L.map('map').setView([40.7589, -111.8883], 4);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    const posts = read('wildora_posts', []);
    const users = read('wildora_users', []);
    
    posts.forEach(post => {
        const author = users.find(u => u.id === post.authorId);
        if (!author || !post.location) return;
        
        const marker = L.marker([post.location.lat, post.location.lng]).addTo(map);
        
        const popupContent = `
            <div style="max-width: 200px;">
                <img src="${post.mediaUrl}" alt="Post" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
                <p style="margin: 0 0 8px 0; font-weight: 600;">${author.displayName}</p>
                <p style="margin: 0 0 8px 0; font-size: 0.9rem;">${post.caption.substring(0, 100)}${post.caption.length > 100 ? '...' : ''}</p>
                <button onclick="openPostModal('${post.id}')" style="background: var(--primary-blue); color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">View Post</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

// Collections
function showCollections() {
    hideAllViews();
    document.getElementById('collectionsView').classList.add('active');
    updateActiveNav('collections');
    loadCollections();
}

function loadCollections() {
    showPhotos(); // Default to photos
}

function showPhotos() {
    document.getElementById('photosCollection').classList.add('active');
    document.getElementById('videosCollection').classList.remove('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    
    const assets = read('wildora_assetsCollection', {});
    const container = document.getElementById('photosCollection');
    
    container.innerHTML = assets.images ? assets.images.map((imageUrl, index) => `
        <div class="collection-item" onclick="openCollectionItem('${imageUrl}', 'image', ${index})">
            <img src="${imageUrl}" alt="Photo ${index + 1}" class="collection-media">
            <div class="collection-info">
                <div class="collection-title">Wildlife Photo ${index + 1}</div>
                <div class="collection-meta">Nature Photography</div>
            </div>
        </div>
    `).join('') : '';
}

function showVideos() {
    document.getElementById('videosCollection').classList.add('active');
    document.getElementById('photosCollection').classList.remove('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    
    const assets = read('wildora_assetsCollection', {});
    const container = document.getElementById('videosCollection');
    
    container.innerHTML = assets.videos ? assets.videos.map((videoUrl, index) => `
        <div class="collection-item" onclick="openCollectionItem('${videoUrl}', 'video', ${index})">
            <video src="${videoUrl}" class="collection-media" muted></video>
            <div class="collection-info">
                <div class="collection-title">Wildlife Video ${index + 1}</div>
                <div class="collection-meta">Nature Videography</div>
            </div>
        </div>
    `).join('') : '';
}

function openCollectionItem(mediaUrl, mediaType, index) {
    // Check if this media is already a post
    const posts = read('wildora_posts', []);
    const existingPost = posts.find(post => post.mediaUrl === mediaUrl);
    
    if (existingPost) {
        openPostModal(existingPost.id);
    } else {
        // Open upload modal with prefilled media
        showUploadModal();
        
        // Simulate file selection
        uploadFile = { type: mediaType === 'image' ? 'image/jpeg' : 'video/mp4' };
        
        const preview = document.getElementById('filePreview');
        const upload = document.getElementById('fileUpload');
        const previewImage = document.getElementById('previewImage');
        const previewVideo = document.getElementById('previewVideo');
        
        upload.style.display = 'none';
        preview.style.display = 'block';
        
        if (mediaType === 'image') {
            previewImage.style.display = 'block';
            previewVideo.style.display = 'none';
            previewImage.src = mediaUrl;
        } else {
            previewVideo.style.display = 'block';
            previewImage.style.display = 'none';
            previewVideo.src = mediaUrl;
        }
        
        // Pre-fill caption
        document.getElementById('uploadCaption').value = `Amazing ${mediaType === 'image' ? 'photo' : 'video'} from my collection`;
        document.getElementById('uploadTags').value = 'wildlife, nature, photography';
        
        validateUploadForm();
    }
}

function searchCollections() {
    const query = document.getElementById('collectionSearch').value.toLowerCase().trim();
    const items = document.querySelectorAll('.collection-item');
    
    items.forEach(item => {
        const title = item.querySelector('.collection-title').textContent.toLowerCase();
        const meta = item.querySelector('.collection-meta').textContent.toLowerCase();
        
        if (title.includes(query) || meta.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Chat System
function toggleChat() {
    const drawer = document.getElementById('chatDrawer');
    const overlay = document.getElementById('overlay');
    
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
    } else {
        drawer.classList.add('open');
        overlay.classList.add('active');
        loadChatUsers();
    }
}

function loadChatUsers() {
    if (!currentUser) {
        showNotification('Please login to use chat', 'error');
        toggleChat();
        return;
    }
    
    const users = read('wildora_users', []);
    const otherUsers = users.filter(u => u.id !== currentUser.id);
    const container = document.getElementById('chatUsers');
    
    container.innerHTML = otherUsers.map(user => `
        <div class="chat-user" onclick="openChatRoom('${user.id}')">
            <img src="${user.avatarUrl}" alt="${user.displayName}" class="chat-avatar">
            <div class="chat-user-info">
                <div class="chat-user-name">${user.displayName}</div>
                <div class="chat-user-status">Online</div>
            </div>
        </div>
    `).join('');
    
    showChatUsers();
}

function showChatUsers() {
    document.getElementById('chatUsers').style.display = 'block';
    document.getElementById('chatRoom').style.display = 'none';
    currentChatPartner = null;
}

function openChatRoom(partnerId) {
    const users = read('wildora_users', []);
    const partner = users.find(u => u.id === partnerId);
    
    if (!partner) return;
    
    currentChatPartner = partner;
    
    document.getElementById('chatUsers').style.display = 'none';
    document.getElementById('chatRoom').style.display = 'flex';
    
    document.getElementById('chatPartnerAvatar').src = partner.avatarUrl;
    document.getElementById('chatPartnerName').textContent = partner.displayName;
    
    loadChatMessages(partnerId);
}

function loadChatMessages(partnerId) {
    const roomId = [currentUser.id, partnerId].sort().join('-');
    const chats = read('wildora_chats', {});
    const chat = chats[roomId] || { messages: [] };
    
    const container = document.getElementById('chatMessages');
    const users = read('wildora_users', []);
    
    container.innerHTML = chat.messages.map(message => {
        const sender = users.find(u => u.id === message.senderId);
        const isOwn = message.senderId === currentUser.id;
        
        return `
            <div class="message ${isOwn ? 'own' : ''}">
                <img src="${sender.avatarUrl}" alt="${sender.displayName}" class="message-avatar">
                <div class="message-content">
                    ${message.text}
                    <div class="message-time">${formatTimeAgo(message.timestamp)}</div>
                </div>
            </div>
        `;
    }).join('');
    
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    if (!currentChatPartner || !currentUser) return;
    
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const roomId = [currentUser.id, currentChatPartner.id].sort().join('-');
    const chats = read('wildora_chats', {});
    
    if (!chats[roomId]) {
        chats[roomId] = {
            roomId: roomId,
            participants: [currentUser.id, currentChatPartner.id],
            messages: []
        };
    }
    
    const newMessage = {
        id: generateId(),
        senderId: currentUser.id,
        text: text,
        timestamp: new Date().toISOString()
    };
    
    chats[roomId].messages.push(newMessage);
    save('wildora_chats', chats);
    
    input.value = '';
    loadChatMessages(currentChatPartner.id);
    
    // Simulate bot reply after 1 second
    setTimeout(() => {
        const botReply = {
            id: generateId(),
            senderId: currentChatPartner.id,
            text: getBotReply(text),
            timestamp: new Date().toISOString()
        };
        
        chats[roomId].messages.push(botReply);
        save('wildora_chats', chats);
        loadChatMessages(currentChatPartner.id);
    }, 1000);
}

function getBotReply(userMessage) {
    const replies = [
        "That's a great shot! Where did you take it?",
        "I love wildlife photography too! Any tips for beginners?",
        "Amazing capture! The lighting is perfect.",
        "Thanks for sharing! I'd love to visit that location someday.",
        "Your photography skills are incredible!",
        "That's such a beautiful moment captured in time.",
        "Wildlife photography requires so much patience. Well done!",
        "The composition in your photos is always stunning."
    ];
    
    return replies[Math.floor(Math.random() * replies.length)];
}

// Modal Management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    modal.classList.add('active');
    
    // Focus trap
    const focusableElements = modal.querySelectorAll('button, input, textarea, select, a[href]');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.classList.remove('active');
    
    // Clean up maps
    if (modalId === 'postModal' && postModalMap) {
        postModalMap.remove();
        postModalMap = null;
    }
    if (modalId === 'uploadModal' && uploadMap) {
        uploadMap.remove();
        uploadMap = null;
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('active');
    });
    
    // Close chat drawer
    const drawer = document.getElementById('chatDrawer');
    const overlay = document.getElementById('overlay');
    drawer.classList.remove('open');
    overlay.classList.remove('active');
}

// Navigation
function hideAllViews() {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
}

function updateActiveNav(activeNav) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const navItem = document.querySelector(`[data-nav="${activeNav}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
}

// Mobile Navigation
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('active');
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// URL Hash Navigation
window.addEventListener('hashchange', handleHashChange);

function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    if (hash.startsWith('post=')) {
        const postId = hash.substring(5);
        openPostModal(postId);
    } else if (hash === 'map') {
        showMap();
    } else if (hash === 'collections') {
        showCollections();
    } else {
        showFeed();
    }
}

// Initialize hash navigation on load
window.addEventListener('load', handleHashChange);

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Note: Service worker would need to be implemented separately
        console.log('Service Worker support detected');
    });
}

// Responsive Image Loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Only handle shortcuts when no modal is open and no input is focused
    if (document.querySelector('.modal.active') || 
        document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(e.key) {
        case 'h':
            showFeed();
            break;
        case 'm':
            showMap();
            break;
        case 'c':
            showCollections();
            break;
        case 'u':
            if (currentUser) showUploadModal();
            break;
        case '/':
            e.preventDefault();
            document.getElementById('searchInput').focus();
            break;
    }
});

// Touch Gestures for Mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            // Swipe left - open chat
            if (!document.getElementById('chatDrawer').classList.contains('open')) {
                toggleChat();
            }
        } else {
            // Swipe right - close chat
            if (document.getElementById('chatDrawer').classList.contains('open')) {
                toggleChat();
            }
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});

// Performance Monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

measurePerformance();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An error occurred. Please try again.', 'error');
});

// Local Storage Cleanup
function cleanupLocalStorage() {
    try {
        // Remove old object URLs to prevent memory leaks
        const posts = read('wildora_posts', []);
        posts.forEach(post => {
            if (post.mediaUrl && post.mediaUrl.startsWith('blob:')) {
                // Note: Object URLs are automatically cleaned up on page reload
                // This is just for demonstration
            }
        });
    } catch (error) {
        console.error('Error cleaning up localStorage:', error);
    }
}

// Run cleanup on page unload
window.addEventListener('beforeunload', cleanupLocalStorage);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Wildora app fully loaded and ready!');
    });
} else {
    console.log('Wildora app fully loaded and ready!');
}