// Handle routing
document.addEventListener("DOMContentLoaded", function () {
    // Routes configuration
    const routes = {
        '/': './index.html',
        '/about': './about.html',
    };

    // Get the current path
    function handleRouting() {
        const path = window.location.pathname;

        // If the path exists in our routes, update the content accordingly
        if (routes[path]) {
            loadPage(routes[path]);
        } else {
            loadPage('./404.html'); // Show 404 if no route found, updated path here too
        }
    }

    // Load the HTML content dynamically (AJAX)
    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                document.querySelector('main').innerHTML = html;
            })
            .catch(err => console.error("Error loading the page: ", err));
    }

    // Initial route handling
    handleRouting();

    // Update URL without reloading the page
    window.addEventListener('popstate', handleRouting);

    // Handle clicks on navigation links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the default link behavior
            const targetPath = link.getAttribute('href');
            history.pushState(null, '', targetPath); // Change URL
            handleRouting(); // Load the new content based on the URL
        });
    });
});
