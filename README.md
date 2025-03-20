# Optijonko - Memories Website

A beautiful, responsive website to capture and showcase the best moments of a friend group. The website features a modern design with smooth animations, image gallery, and video background.

## Overview

"Optijonko" is a personal memories website designed to share photos and moments from events, vacations, and gatherings. The tagline "once you pop, the fun doesn't stop" captures the spirit of the site - a place to relive and celebrate special times together.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices from mobile to desktop
- **Video Background Hero**: Dynamic video background that adapts to device size with sound toggle option
- **Memory Gallery**: Image gallery with filtering and search functionality
- **Fullscreen Image Viewer**: Click on any image to view in fullscreen mode with navigation controls
- **Animated Interface**: Smooth animations and transitions using AOS (Animate On Scroll)
- **Accessibility Features**: Includes skip links, proper ARIA attributes, and keyboard navigation
- **Mobile Navigation**: Hamburger menu for smaller screens

## Project Structure

```
├── .idea/                 # IDE configuration files
├── content/               # Website assets
│   ├── css/               # CSS stylesheets
│   │   └── style.css      # Main stylesheet
│   ├── js/                # JavaScript files
│   │   ├── home.js        # Home page functionality
│   │   └── script.js      # General scripts
│   ├── img/               # Image files (not shown in repository)
│   └── video/             # Video files (not shown in repository)
├── 404.html               # Custom 404 error page
├── CNAME                  # Domain configuration for hosting
├── LICENSE                # Apache 2.0 license
├── index.html             # Main website page
└── README.md              # Project documentation
```

## Technologies Used

- HTML5
- CSS3 (with custom properties/variables)
- Vanilla JavaScript (ES6+)
- [Font Awesome](https://fontawesome.com/) - for icons
- [Google Fonts](https://fonts.google.com/) - Poppins font family
- [AOS](https://michalsnik.github.io/aos/) - Animate On Scroll library

## Setup & Installation

This is a static website that can be hosted on any web server or static hosting service.

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/optijonko.git
   ```

2. Navigate to the project directory:
   ```
   cd optijonko
   ```

3. Open `index.html` in your browser to view the website locally, or upload the files to your web hosting service.

### Requirements for Video

For the video background to work properly, you need to add video files to the `content/video/` directory:

- `desktop-background.mp4` - For desktop devices
- `mobile-background.mp4` - For mobile devices (optimized smaller file)

## Usage

### Adding New Memories

To add new memories to the gallery, edit the `index.html` file and add a new memory card inside the `<div class="gallery" id="memoryGallery">` section following this template:

```html
<div class="memory-card" data-aos="zoom-in" data-aos-delay="100" data-category="category-name" data-date="YYYY-MM-DD">
    <div class="memory-img">
        <div class="img-placeholder"><i class="fas fa-image fa-2x"></i></div>
        <img src="content/img/your-image.jpg" alt="Description of image" class="fullscreen-img" loading="lazy">
        <div class="fullscreen-icon" aria-label="Bekijk foto op volledig scherm"><i class="fas fa-expand"></i></div>
    </div>
    <div class="memory-content">
        <h3 class="memory-title">Memory Title</h3>
        <p class="memory-date"><i class="far fa-calendar-alt"></i> Date displayed</p>
        <p class="memory-description">Description of the memory.</p>
        <div class="memory-tags">
            <span class="memory-tag">Tag1</span>
            <span class="memory-tag">Tag2</span>
        </div>
    </div>
</div>
```

### Adding New Categories

To add a new filter category:

1. Add a new button in the filter controls section:
   ```html
   <button class="filter-btn" data-filter="new-category">New Category</button>
   ```

2. Use the same category name in the `data-category` attribute of your memory cards.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Credits

- Created by Youri Pullens
- Icons provided by [Font Awesome](https://fontawesome.com/)
- Animations powered by [AOS](https://michalsnik.github.io/aos/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

© 2025 De mooiste momenten van de mooiste dagen/avonden
