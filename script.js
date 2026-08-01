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
        
        let html = '<div class="full-menu-grid fade-in visible">';
        category.items.forEach(item => {
            const imgSrc = item.image ? item.image : 'assets/images/logo_clean.png';
            html += `
                <div class="menu-card">
                    <img src="${imgSrc}" alt="${item.name}" class="menu-card-img" onerror="this.src='assets/images/logo_clean.png'">
                    <div class="menu-card-content">
                        <div class="menu-card-header">
                            <h4 class="menu-card-title">${item.name}</h4>
                            <span class="menu-card-price">${item.price}</span>
                        </div>
                        <p class="menu-card-desc">${item.description}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        menuItemsContainer.innerHTML = html;
    }
    // Atmosphere (Day & Night) Toggle
    const atmosBtns = document.querySelectorAll('.atmos-btn');
    const atmosText = document.getElementById('atmos-text');
    const galleries = {
        day: document.getElementById('gallery-day'),
        night: document.getElementById('gallery-night')
    };
    
    const descriptions = {
        day: 'Soak in the sun on our relaxing beach chairs right by the sea. Enjoy a premium Freddo Espresso, fresh brunch, and the calming sound of the waves.',
        night: 'Step inside to our striking, high-ceiling architectural interior. Climb the stairs to the cozy second floor, and experience an energetic bar atmosphere with signature cocktails and music.'
    };

    if (atmosBtns.length && atmosText) {
        atmosText.style.transition = 'opacity 0.2s ease';
        atmosBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const atmos = btn.dataset.atmos;
                
                // Toggle active classes
                atmosBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Animate text transition
                atmosText.style.opacity = '0';
                setTimeout(() => {
                    atmosText.textContent = descriptions[atmos];
                    atmosText.style.opacity = '0.9';
                }, 200);
                
                // Toggle active galleries
                Object.keys(galleries).forEach(key => {
                    if (key === atmos) {
                        galleries[key].classList.add('active');
                    } else {
                        galleries[key].classList.remove('active');
                    }
                });
            });
        });
    }
});
