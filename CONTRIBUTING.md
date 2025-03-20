# Contributing to Optijonko

Thank you for considering contributing to the Optijonko memories website! This document outlines the guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be kind and considerate to others when contributing.

## How to Contribute

### Reporting Bugs

If you find a bug in the website, please create an issue with the following information:

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Screenshots (if applicable)
- Browser information (name and version)
- Device information (desktop/mobile, operating system)

### Suggesting Enhancements

If you have ideas for improvements or new features, please create an issue with:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Any relevant mockups or examples
- Explanation of why this enhancement would be valuable

### Pull Requests

If you'd like to contribute code, follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes with clear messages (see Commit Message Guidelines below)
6. Push to your branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

## Style Guidelines

### HTML

- Use semantic HTML5 elements where appropriate
- Use proper indentation (2 spaces)
- Include appropriate ARIA attributes for accessibility
- Add descriptive alt text for all images
- Keep classes and IDs lowercase and hyphen-separated (kebab-case)

### CSS

- Follow the existing CSS structure with CSS variables for consistent theming
- Keep selectors specific but not overly complex
- Add comments for complex styles or sections
- Use the existing responsive breakpoints for consistency
- Follow the existing naming conventions

### JavaScript

- Use ES6+ syntax
- Follow the modular pattern established in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Test across multiple browsers and devices

## Commit Message Guidelines

- Use clear and descriptive commit messages
- Start with a verb in the present tense (e.g., "Add", "Fix", "Update")
- Reference issue numbers when applicable
- Keep the first line under 72 characters
- Use the body of the commit message for detailed explanations if needed

Examples:
```
Add filter functionality for 2023 memories
Fix responsive layout issues on small mobile devices
Update hero video loading for better performance
```

## Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/optijonko.git
   ```

2. Navigate to the project directory:
   ```
   cd optijonko
   ```

3. The site is built with plain HTML, CSS, and JavaScript, so you can simply open `index.html` in your browser to view the website locally.

4. For live reloading during development, you can use tools like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code or any similar tool.

## Adding Content

### Adding New Memories

To add a new memory to the gallery:

1. Add your image to the `content/img/` directory
2. Add a new memory card to the gallery section in `index.html` following the existing pattern:

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

### Adding New Video Content

1. For hero videos, place optimized versions in the `content/video/` directory:
   - `desktop-background.mp4` - For desktop devices (higher resolution)
   - `mobile-background.mp4` - For mobile devices (smaller file size)

2. Ensure videos are properly compressed to maintain good performance

## Project Structure

```
├── .idea/                 # IDE configuration files
├── content/               # Website assets
│   ├── css/               # CSS stylesheets
│   │   └── style.css      # Main stylesheet
│   ├── js/                # JavaScript files
│   │   ├── home.js        # Home page functionality
│   │   └── script.js      # General scripts
│   ├── img/               # Image files
│   └── video/             # Video files
├── 404.html               # Custom 404 error page
├── CNAME                  # Domain configuration for hosting
├── LICENSE                # Apache 2.0 license
├── index.html             # Main website page
└── README.md              # Project documentation
```

## Questions?

If you have any questions or need further clarification, feel free to open an issue with the "question" tag.

Thank you for contributing to Optijonko!
