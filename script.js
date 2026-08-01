document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });
    // Dynamic Menu Loading
    const menuTabsContainer = document.getElementById('menu-tabs');
    const menuItemsContainer = document.getElementById('menu-items-container');
    let allMenuData = [];

    if (menuTabsContainer && menuItemsContainer) {
        fetch('assets/menu_data.json')
            .then(response => response.json())
            .then(data => {
                // Filter out empty categories
                allMenuData = data.filter(cat => cat.items.length > 0);
                renderTabs();
                if(allMenuData.length > 0) {
                    renderMenu(allMenuData[0].id);
                }
            })
            .catch(err => {
                console.error('Error loading menu:', err);
                menuTabsContainer.innerHTML = '<p>Error loading menu.</p>';
            });
    }

    function renderTabs() {
        menuTabsContainer.innerHTML = '';
        allMenuData.forEach((cat, index) => {
            const btn = document.createElement('button');
            btn.className = 'menu-tab';
            if (index === 0) btn.classList.add('active');
            btn.textContent = cat.name;
            btn.dataset.id = cat.id;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                renderMenu(cat.id);
            });
            
            menuTabsContainer.appendChild(btn);
        });
    }

    function renderMenu(categoryId) {
        const category = allMenuData.find(c => c.id === categoryId);
        if (!category) return;
        
        let html = '<div class="menu-list-grid fade-in visible">';
        category.items.forEach(item => {
            html += `
                <div class="menu-list-item">
                    <div class="menu-item-header">
                        <span class="menu-item-name">${item.name}</span>
                        <span class="menu-item-dots"></span>
                        <span class="menu-item-price">${item.price}</span>
                    </div>
                    ${item.description ? `<p class="menu-item-description">${item.description}</p>` : ''}
                </div>
            `;
        });
        html += '</div>';
        menuItemsContainer.innerHTML = html;
    }
});
