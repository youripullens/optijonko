// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true
    });

    // Get DOM elements
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('nav a');

    // Function to handle active navigation
    function setActiveNav() {
        const scrollPosition = window.scrollY;

        // Add scrolled class to navbar when scrolled down
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
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

    // Initial call and event listener for navigation
    setActiveNav();
    window.addEventListener('scroll', setActiveNav);

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

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

    // Fullscreen image functionality
    setupFullscreenGallery();
});

// Function to set up fullscreen image gallery
function setupFullscreenGallery() {
    const modal = document.getElementById('fullscreenModal');
    const modalImg = document.getElementById('fullscreenImage');
    const modalCaption = document.getElementById('fullscreenCaption');
    const closeBtn = document.getElementById('closeFullscreen');
    const fullscreenImages = document.querySelectorAll('.fullscreen-img');
    const fullscreenIcons = document.querySelectorAll('.fullscreen-icon');

    // Better mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.innerWidth <= 768) ||
        ('ontouchstart' in window);

    // Function to open fullscreen modal
    function openFullscreen(imgSrc, caption) {
        console.log("Opening fullscreen with:", imgSrc); // Debug log

        // Create a new image to get the original dimensions
        const preloadImg = new Image();
        preloadImg.src = imgSrc;

        function displayImage() {
            // Set modal image source
            modalImg.src = imgSrc;
            modalCaption.textContent = caption;

            // Calculate appropriate size for the modal content
            const viewportWidth = window.innerWidth * 0.95;
            const viewportHeight = window.innerHeight * 0.85;

            // Handle image display based on its dimensions
            if (preloadImg.width > viewportWidth || preloadImg.height > viewportHeight) {
                // Image is larger than viewport, use contain
                modalImg.style.objectFit = 'contain';
            } else {
                // Image is smaller than viewport, display at actual size
                modalImg.style.objectFit = 'none';
            }

            modalImg.style.width = 'auto';
            modalImg.style.height = 'auto';
            modalImg.style.maxWidth = '95vw';
            modalImg.style.maxHeight = '85vh';

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        if (preloadImg.complete) {
            displayImage();
        } else {
            preloadImg.onload = displayImage;

            // If image fails to load, show anyway
            preloadImg.onerror = function() {
                modalImg.src = imgSrc;
                modalCaption.textContent = caption;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            };

            // Fallback in case onload doesn't trigger
            setTimeout(() => {
                if (!modal.classList.contains('active')) {
                    displayImage();
                }
            }, 300);
        }
    }

    // Function to close fullscreen modal
    function closeFullscreen() {
        modal.classList.remove('active');

        // Re-enable scrolling
        document.body.style.overflow = 'auto';

        // Clear src after animation completes
        setTimeout(() => {
            modalImg.src = '';
        }, 300);
    }

    // Handle image clicks - simplified for all devices
    fullscreenImages.forEach(img => {
        // Clear any existing listeners by cloning
        const clone = img.cloneNode(true);
        img.parentNode.replaceChild(clone, img);

        // Add both touch and click listeners
        clone.addEventListener('click', function(e) {
            e.preventDefault();
            const imgSrc = this.getAttribute('src');
            const caption = this.getAttribute('alt');
            openFullscreen(imgSrc, caption);
        });
    });

    // Add click event listeners to all fullscreen icons
    fullscreenIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the event from bubbling up

            const imgContainer = this.closest('.memory-img');
            const img = imgContainer.querySelector('img');
            const imgSrc = img.getAttribute('src');
            const caption = img.getAttribute('alt');

            openFullscreen(imgSrc, caption);
        });
    });

    // Close modal handlers
    closeBtn.addEventListener('click', closeFullscreen);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeFullscreen();
        }
    });

    // Close modal on escape key (for desktop)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeFullscreen();
        }
    });
}

// Handle initial page load (show section based on hash)
window.addEventListener('load', function() {
    const hash = window.location.hash || '#home';
    const targetSection = document.querySelector(hash);

    if (targetSection) {
        setTimeout(() => {
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });

            // Update active state in navigation
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === hash) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }
});