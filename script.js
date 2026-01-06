// Data Structure for Projects
    const swProjectsData = [
        {
            id: 1,
            title: "House architecture design in Los Angeles, CA",
            description: "A modern minimalist residence featuring natural wood textures, panoramic window walls, and an open-plan kitchen designed for seamless indoor-outdoor living in the Hollywood Hills.",
            // Using Unsplash IDs for realistic imagery matching the style
            images: [
                "https://images.pexels.com/photos/262367/pexels-photo-262367.jpeg", // Main Kitchen
                "https://images.pexels.com/photos/1619660/pexels-photo-1619660.jpeg", // Bedroom thumb
                "https://images.pexels.com/photos/533157/pexels-photo-533157.jpeg"  // Bathroom thumb
            ]
        },
        {
            id: 2,
            title: "Remodeling in Brooklyn Heights, New York",
            description: "A complete renovation of a historic brownstone, preserving original molding details while introducing contemporary fixtures, a chef's kitchen, and a rooftop garden oasis.",
            images: [
                "https://images.pexels.com/photos/6958122/pexels-photo-6958122.jpeg", // Brownstone Kitchen
                "https://images.pexels.com/photos/30355549/pexels-photo-30355549.jpeg", // Living room thumb
                "https://images.pexels.com/photos/6125668/pexels-photo-6125668.jpeg"  // Exterior thumb
            ]
        },
        {
            id: 3,
            title: "Office architecture design in Manhattan, New York",
            description: "An award-winning commercial space characterized by sustainable materials, collaborative breakout zones, and ergonomic workstations overlooking Central Park.",
            images: [
                "https://images.pexels.com/photos/5490364/pexels-photo-5490364.jpeg", // Office main
                "https://images.pexels.com/photos/5490363/pexels-photo-5490363.jpeg", // Meeting room thumb
                "https://images.pexels.com/photos/3172740/pexels-photo-3172740.jpeg"  // Lounge thumb
            ]
        }
    ];

    // State initialization
    let swActiveProjectIndex = 0;
    let swActiveImageIndex = 0;

    const swMainImageElement = document.getElementById('sw-main-display-img');
    const swThumbnailsContainer = document.getElementById('sw-thumbnails-container');
    const swAccordionContainer = document.getElementById('sw-accordion-container');

    // Function to render the whole component state
    function swRenderComponent() {
        swRenderAccordion();
        swRenderImages();
    }

    // Function to render images based on active state
    function swRenderImages() {
        const activeProject = swProjectsData[swActiveProjectIndex];
        
        // Fade effect for main image change
        swMainImageElement.style.opacity = '0';
        setTimeout(() => {
             swMainImageElement.src = activeProject.images[swActiveImageIndex];
             swMainImageElement.style.opacity = '1';
        }, 200);
       

        // Render Thumbnails
        swThumbnailsContainer.innerHTML = '';
        activeProject.images.forEach((imgSrc, index) => {
            const thumbBtn = document.createElement('div');
            thumbBtn.className = `sw-thumbnail ${index === swActiveImageIndex ? 'active' : ''}`;
            thumbBtn.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}">`;
            
            thumbBtn.addEventListener('click', () => {
                swActiveImageIndex = index;
                swRenderImages(); // Re-render just images part
            });
            
            swThumbnailsContainer.appendChild(thumbBtn);
        });
    }

    // Function to render accordion items
    function swRenderAccordion() {
        swAccordionContainer.innerHTML = '';
        swProjectsData.forEach((project, index) => {
            const isActive = index === swActiveProjectIndex;
            
            const accItem = document.createElement('div');
            accItem.className = `sw-acc-item ${isActive ? 'active' : ''}`;
            
            accItem.innerHTML = `
                <div class="sw-acc-header">
                    <h3>${project.title}</h3>
                </div>
                <div class="sw-acc-content">
                    <p class="sw-acc-description">${project.description}</p>
                    <button class="sw-plus-btn">+</button>
                </div>
            `;

            // Add click handler to accordion header
            accItem.querySelector('.sw-acc-header').addEventListener('click', () => {
                if (swActiveProjectIndex !== index) {
                    swActiveProjectIndex = index;
                    swActiveImageIndex = 0; // Reset image index for new project
                    swRenderComponent(); // Re-render everything
                }
            });

            swAccordionContainer.appendChild(accItem);
        });
    }

    // Initial Render on Page Load
    document.addEventListener('DOMContentLoaded', swRenderComponent);
