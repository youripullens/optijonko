/**
 * Home Page JavaScript
 * Handles all interactive functionality for the memories website
 */
document.addEventListener('DOMContentLoaded', function () {
    const app = new MemoriesApp();
    app.init();
});

/**
 * MemoriesApp - Main application class
 * Organizes all functionality in a modular structure
 */
class MemoriesApp {
    constructor() {
        // DOM elements cache
        this.elements = {
            loader: document.getElementById('pageLoader'),
            navbar: document.getElementById('navbar'),
            navLinks: document.querySelectorAll('nav a'),
            hamburgerBtn: document.getElementById('hamburgerBtn'),
            navMenu: document.getElementById('navMenu'),
            navOverlay: document.getElementById('navOverlay'),
            backToTopBtn: document.getElementById('backToTopBtn'),
            searchBox: document.getElementById('searchBox'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            memoryCards: document.querySelectorAll('.memory-card'),
            imgPlaceholders: document.querySelectorAll('.img-placeholder'),
            hero: document.getElementById('hero'),
            heroVideo: document.getElementById('heroVideo'),
            heroContent: document.getElementById('heroContent'),
            soundToggle: document.getElementById('soundToggle'),
            soundNotification: document.getElementById('soundNotification'),
            scrollIndicator: document.querySelector('.scroll-indicator')
        };

        // Video sources
        this.videoSources = {
            desktop: '/content/video/desktop-background.mp4',
            mobile: '/content/video/mobile-background.mp4'
        };

        // State variables
        this.state = {
            userInactive: false,
            soundOn: false,
            currentImageIndex: 0,
            inactivityTimer: null,
            fadeTimer: null,
            lastBreakpoint: window.innerWidth < 768 ? 'mobile' : 'desktop'
        };

        // Fullscreen gallery elements
        this.gallery = {
            modal: document.getElementById('fullscreenModal'),
            image: document.getElementById('fullscreenImage'),
            caption: document.getElementById('fullscreenCaption'),
            closeBtn: document.getElementById('closeFullscreen'),
            prevBtn: document.getElementById('prevImage'),
            nextBtn: document.getElementById('nextImage'),
            images: Array.from(document.querySelectorAll('.fullscreen-img')),
            icons: document.querySelectorAll('.fullscreen-icon')
        };
    }

    /**
     * Initialize the application
     */
    init() {
        this.initLoading();
        this.initAOS();
        this.initNavigation();
        this.initVideoBackground();
        this.initFiltersAndSearch();
        this.initFullscreenGallery();
        this.checkInitialHash();
    }

    /**
     * Initialize loading functionality
     */
    initLoading() {
        // Hide loader when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.elements.loader.classList.remove('active');
            }, 500);

            this.handleImageLoading();
        });
    }

    /**
     * Handle image loading and placeholders
     */
    handleImageLoading() {
        const images = document.querySelectorAll('.memory-img img');

        images.forEach(img => {
            if (img.complete) {
                // Image already loaded
                const placeholder = img.parentElement.querySelector('.img-placeholder');
                if (placeholder) placeholder.classList.add('hidden');
            } else {
                // Set up load event for image
                img.addEventListener('load', function () {
                    const placeholder = img.parentElement.querySelector('.img-placeholder');
                    if (placeholder) placeholder.classList.add('hidden');
                });

                // Handle image load errors
                img.addEventListener('error', function () {
                    console.warn(`Failed to load image: ${img.src}`);
                    // Keep placeholder visible on error
                });
            }
        });
    }

    /**
     * Initialize AOS animation library
     */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true
            });
        } else {
            console.warn('AOS library not loaded');
        }
    }

    /**
     * Initialize navigation functionality
     */
    initNavigation() {
        // Set active nav based on scroll position
        this.updateNavigation();
        window.addEventListener('scroll', () => this.updateNavigation());

        // Mobile menu toggle
        this.elements.hamburgerBtn.addEventListener('click', () => this.toggleMobileMenu());
        this.elements.navOverlay.addEventListener('click', () => this.closeMobileMenu());

        // Back to top button
        this.elements.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Scroll indicator
        this.elements.scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });

        // Smooth scrolling for navigation links
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavLinkClick(e, link));
        });
    }

    /**
     * Update navigation based on scroll position
     */
    updateNavigation() {
        const scrollPosition = window.scrollY;
        const heroHeight = this.elements.hero.offsetHeight;

        // Show/hide navbar based on scroll position
        if (scrollPosition > heroHeight * 0.8) {
            this.elements.navbar.classList.add('visible');
        } else {
            this.elements.navbar.classList.remove('visible');
        }

        // Add scrolled class to navbar when scrolled down
        if (scrollPosition > 50) {
            this.elements.navbar.classList.add('scrolled');
        } else {
            this.elements.navbar.classList.remove('scrolled');
        }

        // Show/hide back to top button
        if (scrollPosition > heroHeight) {
            this.elements.backToTopBtn.classList.add('visible');
        } else {
            this.elements.backToTopBtn.classList.remove('visible');
        }

        // Pause/play the hero video based on scroll position
        if (scrollPosition > heroHeight * 0.5) {
            // If user has scrolled past half of the hero section, pause the video
            if (!this.elements.heroVideo.paused) {
                this.elements.heroVideo.pause();
            }
        } else {
            // If user is viewing the hero section, play the video
            if (this.elements.heroVideo.paused && !document.hidden) {
                this.playVideo();
            }
        }

        // Set active nav item based on scroll position
        this.updateActiveNavItem(scrollPosition);
    }

    /**
     * Update active navigation item based on scroll position
     * @param {number} scrollPosition - Current scroll position
     */
    updateActiveNavItem(scrollPosition) {
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.elements.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        this.elements.navMenu.classList.toggle('active');
        this.elements.navOverlay.classList.toggle('active');
        document.body.style.overflow = this.elements.navMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.elements.navMenu.classList.remove('active');
        this.elements.navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /**
     * Handle navigation link click
     * @param {Event} e - Click event
     * @param {Element} link - Clicked navigation link
     */
    handleNavLinkClick(e, link) {
        e.preventDefault();

        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (!targetSection) {
            console.warn(`Target section not found: ${targetId}`);
            return;
        }

        // Close mobile menu if open
        this.closeMobileMenu();

        window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, targetId);

        // Update active state
        this.elements.navLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
    }

    /**
     * Initialize video background functionality
     */
    initVideoBackground() {
        // Set appropriate video source
        this.setVideoSource();

        // Setup user activity tracking for hero section
        this.setupActivityTracking();

        // Add sound toggle functionality
        this.setupSoundToggle();

        // Update video source on window resize
        window.addEventListener('resize', () => this.handleResize());

        // Handle visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    /**
     * Set appropriate video source based on device
     */
    setVideoSource() {
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || window.innerWidth < 768;

        // Remember sound state
        const wasMuted = this.elements.heroVideo.muted;

        // Create source element
        const source = document.createElement('source');
        source.src = isMobile ? this.videoSources.mobile : this.videoSources.desktop;
        source.type = 'video/mp4';

        // Clear existing sources
        this.elements.heroVideo.innerHTML = '';
        this.elements.heroVideo.appendChild(source);

        // Add fallback image
        const fallbackImg = document.createElement('img');
        fallbackImg.src = source.src.replace('.mp4', '.jpg');
        fallbackImg.alt = 'Onze mooiste momenten';
        this.elements.heroVideo.appendChild(fallbackImg);

        // Ensure video is muted for autoplay
        this.elements.heroVideo.muted = true;

        // Load and play the video
        this.elements.heroVideo.load();
        this.playVideo();

        // Restore sound state if it was unmuted
        if (!wasMuted && this.state.soundOn) {
            this.showNotification('Please re-enable sound');
        }
    }

    /**
     * Play video with error handling
     */
    playVideo() {
        this.elements.heroVideo.play().catch(e => {
            console.log('Autoplay prevented:', e);
            this.createPlayButton();
        });
    }

    /**
     * Create play button if autoplay is prevented
     */
    createPlayButton() {
        const playButtonExists = document.querySelector('.video-play-btn');
        if (!playButtonExists) {
            const playButton = document.createElement('button');
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            playButton.className = 'video-play-btn';
            playButton.setAttribute('aria-label', 'Play video');
            this.elements.heroContent.appendChild(playButton);

            playButton.addEventListener('click', () => {
                this.elements.heroVideo.play().then(() => {
                    playButton.style.display = 'none';
                }).catch(e => {
                    console.log('Play prevented:', e);
                    this.showNotification('Video play prevented by browser');
                });
            });
        }
    }

    /**
     * Show notification message
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    showNotification(message, duration = 3000) {
        this.elements.soundNotification.querySelector('span').textContent = message;
        this.elements.soundNotification.classList.add('show');

        setTimeout(() => {
            this.elements.soundNotification.classList.remove('show');
        }, duration);
    }

    /**
     * Setup user activity tracking for hero section
     */
    setupActivityTracking() {
        // Start inactivity tracking
        this.startInactivityTracking();

        // Setup event listeners for user activity
        const activityEvents = ['mousemove', 'click', 'keydown', 'scroll'];
        activityEvents.forEach(event => {
            document.addEventListener(event, () => this.handleUserActivity());
        });

        // Touch events need passive option for better performance
        document.addEventListener('touchstart', () => this.handleUserActivity(), {passive: true});
    }

    /**
     * Start inactivity tracking timer
     */
    startInactivityTracking() {
        // Clear any existing timers
        clearTimeout(this.state.inactivityTimer);
        clearTimeout(this.state.fadeTimer);

        // Start inactivity timer - text fades after 4 seconds of no interaction
        this.state.inactivityTimer = setTimeout(() => {
            this.state.userInactive = true;
            // Fade out text
            this.state.fadeTimer = setTimeout(() => {
                this.elements.heroContent.classList.add('fade-out');
            }, 1000);
        }, 4000);
    }

    /**
     * Handle user activity
     */
    handleUserActivity() {
        // Clear existing timers
        clearTimeout(this.state.inactivityTimer);
        clearTimeout(this.state.fadeTimer);

        // If text was faded out, fade it back in
        if (this.state.userInactive) {
            this.elements.heroContent.classList.remove('fade-out');
            this.state.userInactive = false;
        }

        // Restart inactivity tracking
        this.startInactivityTracking();
    }

    /**
     * Setup sound toggle functionality
     */
    setupSoundToggle() {
        // Sound toggle button click handler
        this.elements.soundToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSound();
        });

        // Keyboard shortcut for sound toggle (M key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                this.toggleSound();
            }
        });

        // Show initial sound notification
        setTimeout(() => {
            this.showNotification('Press sound icon or "M" key for audio');
        }, 2000);
    }

    /**
     * Toggle video sound
     */
    toggleSound() {
        try {
            const video = this.elements.heroVideo;

            // Check if video is currently muted
            if (video.muted || video.volume === 0) {
                // UNMUTING: First, ensure video is playing
                video.play().then(() => {
                    // Unmute using both properties
                    video.muted = false;
                    video.volume = 1.0; // Ensure volume is up

                    // Update UI and state
                    this.elements.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                    this.state.soundOn = true;
                    this.elements.soundToggle.classList.add('sound-on');
                    this.showNotification('Sound turned on');
                }).catch(e => {
                    console.error('Error playing video for sound toggle:', e);
                    this.showNotification('Browser prevented sound playback');
                });
            } else {
                // MUTING: Mute the video
                video.muted = true;
                video.volume = 0; // Also set volume to 0 to ensure muting works

                // Update UI and state
                this.elements.soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                this.state.soundOn = false;
                this.elements.soundToggle.classList.remove('sound-on');
                this.showNotification('Sound turned off');
            }
        } catch (error) {
            console.error('Error toggling sound:', error);
            this.showNotification('Error toggling sound');
        }
    }

    /**
     * Handle window resize event
     */
    handleResize() {
        const currentBreakpoint = window.innerWidth < 768 ? 'mobile' : 'desktop';

        if (currentBreakpoint !== this.state.lastBreakpoint) {
            this.state.lastBreakpoint = currentBreakpoint;

            // Remember sound state before changing source
            const soundWasOn = this.state.soundOn;
            this.setVideoSource();

            // If sound was on, show notification to re-enable
            if (soundWasOn) {
                setTimeout(() => {
                    this.showNotification('Please re-enable sound after resize');
                }, 1000);
            }
        }

        // Reset inactivity tracking on resize
        this.handleUserActivity();
    }

    /**
     * Handle document visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.elements.heroVideo.pause();
        } else {
            this.playVideo();

            // Reset inactivity tracking when tab becomes visible again
            this.handleUserActivity();
        }
    }

    /**
     * Initialize filters and search functionality
     */
    initFiltersAndSearch() {
        // Filter functionality
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn));
        });

        // Search functionality
        this.elements.searchBox.addEventListener('input', () => this.handleSearch());
    }

    /**
     * Handle filter button click
     * @param {Element} btn - Clicked filter button
     */
    handleFilter(btn) {
        // Update active state
        this.elements.filterBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        // Show/hide memory cards based on filter
        this.elements.memoryCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else if (card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else if (filter === '2024' && card.getAttribute('data-date').includes('2024')) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Handle search input
     */
    handleSearch() {
        const searchTerm = this.elements.searchBox.value.toLowerCase();

        this.elements.memoryCards.forEach(card => {
            const title = card.querySelector('.memory-title').textContent.toLowerCase();
            const desc = card.querySelector('.memory-description').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.memory-tag')).map(tag => tag.textContent.toLowerCase());

            if (title.includes(searchTerm) || desc.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Initialize fullscreen gallery
     */
    initFullscreenGallery() {
        // Add click handlers to images and icons
        this.gallery.images.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.openFullscreen(img.src, img.alt, index);
            });
        });

        this.gallery.icons.forEach((icon, index) => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const imgContainer = icon.closest('.memory-img');
                const img = imgContainer.querySelector('img');
                this.openFullscreen(img.src, img.alt, index);
            });
        });

        // Close modal handlers
        this.gallery.closeBtn.addEventListener('click', () => this.closeFullscreen());
        this.gallery.modal.addEventListener('click', (e) => {
            if (e.target === this.gallery.modal) {
                this.closeFullscreen();
            }
        });

        // Navigation handlers
        this.gallery.prevBtn.addEventListener('click', () => this.navigateImage(-1));
        this.gallery.nextBtn.addEventListener('click', () => this.navigateImage(1));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleGalleryKeydown(e));
    }

    /**
     * Open fullscreen gallery
     * @param {string} imgSrc - Image source URL
     * @param {string} caption - Image caption
     * @param {number} index - Image index
     */
    openFullscreen(imgSrc, caption, index) {
        this.state.currentImageIndex = index;
        this.gallery.image.src = imgSrc;
        this.gallery.caption.textContent = caption;
        this.gallery.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Preload adjacent images
        this.preloadAdjacentImages();

        // Update navigation visibility
        this.updateGalleryNavButtons();
    }

    /**
     * Close fullscreen gallery
     */
    closeFullscreen() {
        this.gallery.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /**
     * Navigate to previous or next image
     * @param {number} direction - Navigation direction (-1 for previous, 1 for next)
     */
    navigateImage(direction) {
        if (this.gallery.images.length <= 1) return;

        this.state.currentImageIndex = (this.state.currentImageIndex + direction + this.gallery.images.length) % this.gallery.images.length;
        const img = this.gallery.images[this.state.currentImageIndex];

        this.gallery.image.src = img.src;
        this.gallery.caption.textContent = img.alt;

        // Preload adjacent images
        this.preloadAdjacentImages();

        this.updateGalleryNavButtons();
    }

    /**
     * Preload adjacent images for smoother navigation
     */
    preloadAdjacentImages() {
        if (this.gallery.images.length <= 1) return;

        const nextIndex = (this.state.currentImageIndex + 1) % this.gallery.images.length;
        const prevIndex = (this.state.currentImageIndex - 1 + this.gallery.images.length) % this.gallery.images.length;

        // Preload next and previous images
        new Image().src = this.gallery.images[nextIndex].src;
        new Image().src = this.gallery.images[prevIndex].src;
    }

    /**
     * Update gallery navigation buttons visibility
     */
    updateGalleryNavButtons() {
        const hasMultipleImages = this.gallery.images.length > 1;
        this.gallery.prevBtn.style.display = hasMultipleImages ? 'block' : 'none';
        this.gallery.nextBtn.style.display = hasMultipleImages ? 'block' : 'none';
    }

    /**
     * Handle keyboard navigation in gallery
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleGalleryKeydown(e) {
        if (!this.gallery.modal.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                this.closeFullscreen();
                break;
            case 'ArrowLeft':
                this.navigateImage(-1);
                break;
            case 'ArrowRight':
                this.navigateImage(1);
                break;
        }
    }

    /**
     * Check initial hash and scroll to target section
     */
    checkInitialHash() {
        const hash = window.location.hash || '#home';
        const targetSection = document.querySelector(hash);

        if (targetSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });

                // Update active state in navigation
                this.elements.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === hash) {
                        link.classList.add('active');
                    }
                });
            }, 100);
        }
    }
}