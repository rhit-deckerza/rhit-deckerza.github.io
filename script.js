document.addEventListener('DOMContentLoaded', function() {
    // Handle email copy functionality
    const copyEmailLink = document.querySelector('.copy-email');
    if (copyEmailLink) {
        copyEmailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const emailText = this.querySelector('b').textContent;
            navigator.clipboard.writeText(emailText)
                .then(() => {
                    // Show a quick feedback
                    const originalText = this.innerHTML;
                    const icon = this.querySelector('svg');
                    const textEl = this.querySelector('b');
                    
                    textEl.textContent = "Copied!";
                    icon.style.opacity = '1';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        });
    }

    // Handle form submission
    const form = document.querySelector('.signup-form');
    const formMessage = document.querySelector('.form-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const school = document.getElementById('school').value;
            const linkedin = document.getElementById('linkedin').value;
            
            // Basic validation
            if (!name || !email || !school) {
                formMessage.textContent = "Please fill in all required fields.";
                return;
            }
            
            // In a real app, we would send the data to a server
            // For this example, we'll just show a success message
            
            // Clear form
            form.reset();
            
            // Show success message
            formMessage.textContent = "Thank you for your interest! We'll reach out when we launch at your school.";
            
            // Clear the message after 5 seconds
            setTimeout(() => {
                formMessage.textContent = "";
            }, 5000);
        });
    }

    // Toggle dark mode feature
    function toggleDarkMode() {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            html.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.remove('light');
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Add theme toggle button functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            toggleDarkMode();
        });
    }

    // Add keyboard shortcut for dark mode toggle (Ctrl+D)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            toggleDarkMode();
        }
    });

    // Initialize theme based on user preference or default to dark
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const html = document.documentElement;
        
        // Make sure it's dark mode by default (reverse of original)
        if (savedTheme === 'light') {
            html.classList.remove('dark');
            html.classList.add('light');
        } else {
            html.classList.remove('light');
            html.classList.add('dark');
        }
    }

    // Initialize theme on page load
    initializeTheme();
}); 