document.addEventListener('DOMContentLoaded', function () {
    // Show loading indicator
    const loader = document.getElementById('pageLoader');
    loader.classList.add('active');

    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        once: true
    });

    // Get DOM elements
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('nav a');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const searchBox = document.getElementById('searchBox');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const memoryCards = document.querySelectorAll('.memory-card');
    const imgPlaceholders = document.querySelectorAll('.img-placeholder');

    // Hide loader when page is fully loaded
    window.addEventListener('load', function () {
        setTimeout(() => {
            loader.classList.remove('active');
        }, 500);

        // Show image placeholders until images are loaded
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
            }
        });
    });

    // Function to handle active navigation and scrolling effects
    function setActiveNav() {
        const scrollPosition = window.scrollY;
        const heroHeight = document.getElementById('hero').offsetHeight;

        // Show/hide navbar based on scroll position
        if (scrollPosition > heroHeight * 0.8) {
            navbar.classList.add('visible');
        } else {
            navbar.classList.remove('visible');
        }

        // Add scrolled class to navbar when scrolled down
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/hide back to top button
        if (scrollPosition > heroHeight) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Set active nav item based on scroll position
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Video background selection based on device
    const heroVideo = document.getElementById('heroVideo');
    const heroContent = document.getElementById('heroContent');
    const soundToggle = document.getElementById('soundToggle');
    const soundNotification = document.getElementById('soundNotification');

    // Define video sources
    const desktopVideo = '/content/video/desktop-background.mp4'; // Path to your desktop video
    const mobileVideo = '/content/video/mobile-background.mp4';   // Path to your mobile video

    // Variable to track user activity
    let userInactive = false;
    let inactivityTimer;
    let fadeTimer;
    let soundOn = false;

    // Function to set the appropriate video source
    function setVideoSource() {
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

        // Store current muted state to restore after loading new source
        const wasMuted = heroVideo.muted;

        // Create source element
        const source = document.createElement('source');

        // Set source based on device type
        if (isMobile) {
            source.src = mobileVideo;
        } else {
            source.src = desktopVideo;
        }

        source.type = 'video/mp4';

        // Clear any existing sources
        heroVideo.innerHTML = '';

        // Add the appropriate source
        heroVideo.appendChild(source);

        // Add fallback image
        const fallbackImg = document.createElement('img');
        fallbackImg.src = isMobile ? mobileVideo.replace('.mp4', '.jpg') : desktopVideo.replace('.mp4', '.jpg');
        fallbackImg.alt = 'Onze mooiste momenten';
        heroVideo.appendChild(fallbackImg);

        // Make sure video is muted for autoplay
        heroVideo.muted = true;

        // Load and play the video
        heroVideo.load();

        heroVideo.addEventListener('canplaythrough', function onCanPlay() {
            heroVideo.play().catch(e => {
                console.log('Autoplay prevented:', e);
                createPlayButton();
            });

            // Restore previous sound state if it was unmuted
            if (!wasMuted && soundOn) {
                // We need a user interaction first, so we can't just unmute here
                // Instead, show a notification that sound needs to be re-enabled
                showNotification('Please re-enable sound');
            }

            // Remove the event listener to prevent multiple calls
            heroVideo.removeEventListener('canplaythrough', onCanPlay);
        }, {once: true});
    }

    // Function to create play button if autoplay is prevented
    function createPlayButton() {
        const playButtonExists = document.querySelector('.video-play-btn');
        if (!playButtonExists) {
            const playButton = document.createElement('button');
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            playButton.className = 'video-play-btn';
            playButton.setAttribute('aria-label', 'Play video');
            document.querySelector('.hero-content').appendChild(playButton);

            playButton.addEventListener('click', () => {
                heroVideo.play().then(() => {
                    playButton.style.display = 'none';
                }).catch(e => {
                    console.log('Play prevented:', e);
                    showNotification('Video play prevented by browser');
                });
            });
        }
    }

    // Function to show notification
    function showNotification(message) {
        soundNotification.querySelector('span').textContent = message;
        soundNotification.classList.add('show');

        setTimeout(() => {
            soundNotification.classList.remove('show');
        }, 3000);
    }

    // Handle sound toggle with better error handling
    soundToggle.addEventListener('click', function () {
        try {
            // Try to unmute the video
            if (heroVideo.muted) {
                // We need to have user interaction to unmute
                // This click counts as user interaction
                const playPromise = heroVideo.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Successfully started playing
                        heroVideo.muted = false;
                        soundOn = true;
                        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                        showNotification('Sound turned on');

                        // Add a flag to the video element to track sound state
                        heroVideo.dataset.soundOn = 'true';
                    }).catch(e => {
                        console.error('Error unmuting video:', e);
                        showNotification('Could not enable sound');
                    });
                }
            } else {
                // Mute the video
                heroVideo.muted = true;
                soundOn = false;
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                showNotification('Sound turned off');

                // Update flag
                heroVideo.dataset.soundOn = 'false';
            }
        } catch (error) {
            console.error('Error toggling sound:', error);
            showNotification('Error toggling sound');
        }
    });

    // Function to handle text fade out when user is inactive
    function startInactivityTracking() {
        // Start inactivity timer - text fades after 4 seconds of no interaction
        inactivityTimer = setTimeout(() => {
            userInactive = true;
            // Fade out text
            fadeTimer = setTimeout(() => {
                heroContent.classList.add('fade-out');
            }, 1000);
        }, 4000);
    }

    // Function to handle user activity
    function handleUserActivity() {
        // Clear existing timers
        clearTimeout(inactivityTimer);
        clearTimeout(fadeTimer);

        // If text was faded out, fade it back in
        if (userInactive) {
            heroContent.classList.remove('fade-out');
            userInactive = false;
        }

        // Restart inactivity tracking
        startInactivityTracking();
    }

    // Track user activity in the hero section
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('click', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('scroll', handleUserActivity);
    document.addEventListener('touchstart', handleUserActivity, {passive: true});

    // Add a keyboard shortcut to toggle sound (press 'M' key)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'm' || e.key === 'M') {
            // Trigger sound toggle programmatically
            soundToggle.click();
        }
    });

    // Make sure the sound toggle is clickable by adding multiple access methods
    document.addEventListener('DOMContentLoaded', function () {
        // Add a prominent initial message about sound
        setTimeout(() => {
            showNotification('Press sound icon or "M" key for audio');
        }, 2000);

        // Add a backup click handler to the entire hero section that checks if click was near sound button
        const heroSection = document.getElementById('hero');
        heroSection.addEventListener('click', function (e) {
            // Get sound toggle button position
            const soundRect = soundToggle.getBoundingClientRect();

            // If click is near the sound button area (expanded hit area)
            if (e.clientX >= soundRect.left - 20 &&
                e.clientX <= soundRect.right + 20 &&
                e.clientY >= soundRect.top - 20 &&
                e.clientY <= soundRect.bottom + 20) {

                // Trigger the sound toggle
                toggleSound();
            }
        });

        // Make sound toggle button extra visible initially
        soundToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            soundToggle.style.transform = 'scale(1)';
        }, 3000);
    });

    // Standalone sound toggle function with improved unmuting logic
    function toggleSound() {
        // Log the current state for debugging
        console.log("Toggle sound called, current muted state:", heroVideo.muted);

        try {
            // Check if video is currently muted
            if (heroVideo.muted || heroVideo.volume === 0) {
                // UNMUTING: First, ensure video is playing
                heroVideo.play().then(() => {
                    // Unmute using both properties
                    heroVideo.muted = false;
                    heroVideo.volume = 1.0; // Ensure volume is up

                    // Update UI
                    soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                    soundOn = true;

                    // Add a class to the sound button to indicate sound is on
                    soundToggle.classList.add('sound-on');

                    // Verify that unmuting worked
                    setTimeout(() => {
                        if (heroVideo.muted) {
                            console.warn("Unmuting failed - video is still muted");
                            showNotification('Unmuting failed, try again');
                        } else {
                            console.log("Successfully unmuted video");
                            showNotification('Sound turned on');
                        }
                    }, 100);

                }).catch(e => {
                    console.error('Error playing video for sound toggle:', e);
                    showNotification('Browser prevented sound playback');
                });
            } else {
                // MUTING: Mute the video - simpler process
                console.log("Muting video");
                heroVideo.muted = true;
                heroVideo.volume = 0; // Also set volume to 0 to ensure muting works
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                soundOn = false;
                soundToggle.classList.remove('sound-on');
                showNotification('Sound turned off');
                console.log("After muting - muted state:", heroVideo.muted);
            }
        } catch (error) {
            console.error('Error in toggleSound function:', error);
            showNotification('Error toggling sound');
        }
    }

    // Replace the click handler with our new function
    soundToggle.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent event bubbling
        toggleSound();
    });

    // Set video source on page load
    setVideoSource();

    // Add audio debug testing function
    function testAudioTrack() {
        // Try to detect if the video has audio tracks
        try {
            let hasAudio = false;

            // Different methods to detect audio tracks
            if (heroVideo.mozHasAudio !== undefined) {
                hasAudio = heroVideo.mozHasAudio;
                console.log("mozHasAudio detection: " + hasAudio);
            } else if (heroVideo.webkitAudioDecodedByteCount !== undefined) {
                hasAudio = heroVideo.webkitAudioDecodedByteCount > 0;
                console.log("webkitAudioDecodedByteCount detection: " + hasAudio);
            } else if (heroVideo.audioTracks !== undefined) {
                hasAudio = heroVideo.audioTracks.length > 0;
                console.log("audioTracks detection: " + hasAudio);
            }

            if (!hasAudio) {
                console.warn("No audio track detected in video!");
                showNotification('Warning: No audio detected in video');
            } else {
                console.log("Audio track detected!");
            }

            return hasAudio;
        } catch (e) {
            console.error("Error detecting audio track:", e);
            return false;
        }
    }

    // Video audio checks once video has loaded
    heroVideo.addEventListener('loadeddata', function () {
        console.log("Video loaded! Testing audio track...");

        // Wait a moment for audio to initialize
        setTimeout(testAudioTrack, 1000);

        // Check volume settings
        console.log("Initial volume:", heroVideo.volume);
        console.log("Initial muted state:", heroVideo.muted);

        // Try to activate audio policies by adding a short user interaction delay
        document.addEventListener('click', function audioActivator() {
            console.log("User interaction detected, attempting audio policy activation");
            heroVideo.muted = true; // Ensure muted first

            // Remove this event after first click
            document.removeEventListener('click', audioActivator);

            // Add an alternative unmute button for direct unmuting
            const directUnmuteBtn = document.createElement('button');
            directUnmuteBtn.innerHTML = 'Direct Unmute';
            directUnmuteBtn.className = 'direct-unmute-btn';
            directUnmuteBtn.style.position = 'absolute';
            directUnmuteBtn.style.bottom = '20px';
            directUnmuteBtn.style.left = '20px';
            directUnmuteBtn.style.padding = '10px 15px';
            directUnmuteBtn.style.backgroundColor = 'rgba(0,0,0,0.7)';
            directUnmuteBtn.style.color = 'white';
            directUnmuteBtn.style.border = 'none';
            directUnmuteBtn.style.borderRadius = '5px';
            directUnmuteBtn.style.cursor = 'pointer';
            directUnmuteBtn.style.zIndex = '100';

            // Direct unmute functionality with added mute toggle capability
            directUnmuteBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                console.log("Direct unmute button clicked, current mute state:", heroVideo.muted);

                // If currently muted, unmute the video
                if (heroVideo.muted || heroVideo.volume === 0) {
                    console.log("Attempting to unmute via direct button");
                    // Video must be played within user gesture handler
                    heroVideo.play().then(function () {
                        console.log("Video playing after direct button click");
                        heroVideo.muted = false;
                        heroVideo.volume = 1.0;

                        if (!heroVideo.muted) {
                            directUnmuteBtn.textContent = 'Mute Video';
                            showNotification('Sound enabled');
                            soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                            soundOn = true;
                            soundToggle.classList.add('sound-on');
                        } else {
                            showNotification('Direct unmute failed');
                        }
                    }).catch(function (err) {
                        console.error("Direct unmute play error:", err);
                        showNotification('Browser prevented unmuting');
                    });
                } else {
                    // If already unmuted, mute the video
                    console.log("Muting via direct button");
                    heroVideo.muted = true;
                    heroVideo.volume = 0;
                    directUnmuteBtn.textContent = 'Direct Unmute';
                    showNotification('Sound disabled');
                    soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    soundOn = false;
                    soundToggle.classList.remove('sound-on');
                }
            });

            document.getElementById('hero').appendChild(directUnmuteBtn);
        }, {once: true});
    });

    // Create and add a debug button
    function addDebugButton() {
        const debugBtn = document.createElement('button');
        debugBtn.innerHTML = 'Debug Audio';
        debugBtn.style.position = 'absolute';
        debugBtn.style.top = '10px';
        debugBtn.style.right = '10px';
        debugBtn.style.padding = '5px 10px';
        debugBtn.style.backgroundColor = 'rgba(255,0,0,0.7)';
        debugBtn.style.color = 'white';
        debugBtn.style.border = 'none';
        debugBtn.style.borderRadius = '5px';
        debugBtn.style.fontSize = '12px';
        debugBtn.style.cursor = 'pointer';
        debugBtn.style.zIndex = '1000';

        debugBtn.addEventListener('click', function () {
            console.log("Debug button clicked");
            console.log("Current video element:", heroVideo);
            console.log("Video paused state:", heroVideo.paused);
            console.log("Video muted state:", heroVideo.muted);
            console.log("Video volume:", heroVideo.volume);
            console.log("Video readyState:", heroVideo.readyState);
            console.log("Has audio track:", testAudioTrack());

            // Try forced unmuting
            heroVideo.play().then(function () {
                heroVideo.muted = false;
                heroVideo.volume = 1.0;
                console.log("After forced unmute - muted:", heroVideo.muted);
                console.log("After forced unmute - volume:", heroVideo.volume);
                showNotification('Debug unmute attempt complete');
            }).catch(function (err) {
                console.error("Debug unmute error:", err);
            });
        });

        document.getElementById('hero').appendChild(debugBtn);
    }

    // Add debug button after a short delay
    setTimeout(addDebugButton, 2000);

    // Update video source if window is resized between breakpoints
    let lastBreakpoint = window.innerWidth < 768 ? 'mobile' : 'desktop';

    window.addEventListener('resize', () => {
        const currentBreakpoint = window.innerWidth < 768 ? 'mobile' : 'desktop';
        if (currentBreakpoint !== lastBreakpoint) {
            lastBreakpoint = currentBreakpoint;
            // Remember sound state before changing source
            const soundWasOn = soundOn;
            setVideoSource();
            // If sound was on, show notification to re-enable
            if (soundWasOn) {
                setTimeout(() => {
                    showNotification('Please re-enable sound after resize');
                }, 1000);
            }
        }

        // Reset inactivity tracking on resize
        handleUserActivity();
    });

    // Pause video when not visible to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            heroVideo.pause();
        } else {
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log('Play prevented on visibility change:', e);
                    createPlayButton();
                });
            }

            // Reset inactivity tracking when tab becomes visible again
            handleUserActivity();
        }
    });

    // Initial call and event listener for navigation
    setActiveNav();
    window.addEventListener('scroll', setActiveNav);

    // Mobile menu toggle
    hamburgerBtn.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when overlay is clicked
    navOverlay.addEventListener('click', function () {
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Back to top button
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll indicator click handler
    const scrollIndicator = document.querySelector('.scroll-indicator');
    scrollIndicator.addEventListener('click', function () {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            // Close mobile menu if open
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';

            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });

            // Update URL hash without jumping
            history.pushState(null, null, targetId);

            // Update active state
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Update active state
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Show/hide memory cards based on filter
            memoryCards.forEach(card => {
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
        });
    });

    // Search functionality
    searchBox.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();

        memoryCards.forEach(card => {
            const title = card.querySelector('.memory-title').textContent.toLowerCase();
            const desc = card.querySelector('.memory-description').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.memory-tag')).map(tag => tag.textContent.toLowerCase());

            if (title.includes(searchTerm) || desc.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Improved fullscreen gallery
    const modal = document.getElementById('fullscreenModal');
    const modalImg = document.getElementById('fullscreenImage');
    const modalCaption = document.getElementById('fullscreenCaption');
    const closeBtn = document.getElementById('closeFullscreen');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    const fullscreenImages = document.querySelectorAll('.fullscreen-img');
    const fullscreenIcons = document.querySelectorAll('.fullscreen-icon');

    let currentImageIndex = 0;
    const images = Array.from(fullscreenImages);

    // Function to open fullscreen modal
    function openFullscreen(imgSrc, caption, index) {
        currentImageIndex = index;
        modalImg.src = imgSrc;
        modalCaption.textContent = caption;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Preload next and previous images
        if (images.length > 1) {
            const nextIndex = (currentImageIndex + 1) % images.length;
            const prevIndex = (currentImageIndex - 1 + images.length) % images.length;

            new Image().src = images[nextIndex].src;
            new Image().src = images[prevIndex].src;
        }

        // Update navigation visibility
        updateNavButtons();
    }

    // Function to close fullscreen modal
    function closeFullscreen() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Function to navigate to next/previous image
    function navigateImage(direction) {
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        const img = images[currentImageIndex];
        modalImg.src = img.src;
        modalCaption.textContent = img.alt;

        // Preload next image
        const nextIndex = (currentImageIndex + direction + images.length) % images.length;
        new Image().src = images[nextIndex].src;

        updateNavButtons();
    }

    // Function to update navigation buttons
    function updateNavButtons() {
        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }

    // Add click event listeners to all images
    fullscreenImages.forEach((img, index) => {
        img.addEventListener('click', function (e) {
            e.preventDefault();
            const imgSrc = this.getAttribute('src');
            const caption = this.getAttribute('alt');
            openFullscreen(imgSrc, caption, index);
        });
    });

    // Add click event listeners to all fullscreen icons
    fullscreenIcons.forEach((icon, index) => {
        icon.addEventListener('click', function (e) {
            e.stopPropagation();
            const imgContainer = this.closest('.memory-img');
            const img = imgContainer.querySelector('img');
            const imgSrc = img.getAttribute('src');
            const caption = img.getAttribute('alt');
            openFullscreen(imgSrc, caption, index);
        });
    });

    // Close modal handlers
    closeBtn.addEventListener('click', closeFullscreen);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeFullscreen();
        }
    });

    // Navigation handlers
    prevBtn.addEventListener('click', function () {
        navigateImage(-1);
    });

    nextBtn.addEventListener('click', function () {
        navigateImage(1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeFullscreen();
        } else if (e.key === 'ArrowLeft') {
            navigateImage(-1);
        } else if (e.key === 'ArrowRight') {
            navigateImage(1);
        }
    });

    // Handle initial page load (show section based on hash)
    const hash = window.location.hash || '#home';
    const targetSection = document.querySelector(hash);

    if (targetSection) {
        setTimeout(() => {
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });

            // Update active state in navigation
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === hash) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }
});