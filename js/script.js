// Helper function to toggle dropdowns and arrow rotation
function toggleDropdown(dropdown, arrow) {
    const isOpen = dropdown.classList.contains("show");
    closeAllDropdowns(); // Close all other dropdowns
    if (!isOpen) {
        dropdown.classList.add("show");
        arrow.classList.add("rotate");
    }
}

// Function to close all dropdowns
function closeAllDropdowns() {
    document.querySelectorAll(".side-dropdown.show").forEach(dropdown => dropdown.classList.remove("show"));
    document.querySelectorAll(".arrow.rotate").forEach(arrow => arrow.classList.remove("rotate"));
}

// Event delegation for dropdown buttons
document.addEventListener("click", function (event) {
    const button = event.target.closest(".dropdown-toggle");
    
    if (button) {
        event.stopPropagation();
        
        const dropdownId = button.getAttribute("data-dropdown");
        const dropdown = document.getElementById(dropdownId);
        const arrow = button.querySelector(".arrow");
        
        if (dropdown && arrow) {
            toggleDropdown(dropdown, arrow);
        }
    } else {
        closeAllDropdowns();
    }
});

// Toggle search bar visibility
function toggleSearchBar() {
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.classList.toggle("show");
        const searchInput = document.getElementById("search-input");
        // Focus the input if the search bar is shown
        if (searchInput && searchBar.classList.contains("show")) {
            searchInput.focus();
        }
    }
}

// Search function
function search() {
    const searchInput = document.getElementById("search-input");
    const searchResult = document.getElementById("search-result");
    
    if (searchInput && searchResult) {
        const query = searchInput.value;
        if (query.trim()) {
            searchResult.innerHTML = `Results for: <strong>${query}</strong>`;
        } else {
            searchResult.innerHTML = `Please enter a search query.`;
        }
    }
}

// Toggle side menu
function toggleSideMenu() {
    const sideMenu = document.getElementById('side-menu');
    if (sideMenu) {
        sideMenu.classList.toggle('active');
    }
}

// Toggle dropdown with ID parameter (resolves function overloading issue)
function toggleMenuDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    const isActive = dropdown.classList.contains('active');
    
    // Close all sibling dropdowns at the same level
    const parentDropdown = dropdown.closest('.dropdown');
    if (parentDropdown) {
        const parentElement = parentDropdown.parentElement;
        if (parentElement) {
            const siblingDropdowns = parentElement.querySelectorAll('.side-dropdown');
            siblingDropdowns.forEach((menu) => {
                if (menu !== dropdown) {
                    menu.classList.remove('active');
                    menu.style.maxHeight = null;
                }
            });
        }
    }
    
    // Toggle the selected dropdown
    if (!isActive) {
        dropdown.classList.add('active');
        dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
    } else {
        dropdown.classList.remove('active');
        dropdown.style.maxHeight = null;
    }
}

// Close other submenus when a new province is clicked
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.dropdown > a').forEach((link) => {
        link.addEventListener('click', () => {
            const allSubMenus = document.querySelectorAll('.side-dropdown');
            allSubMenus.forEach((submenu) => {
                if (!submenu.parentElement.contains(link)) {
                    submenu.classList.remove('active');
                    submenu.style.maxHeight = null;
                }
            });
        });
    });
});
// Initialize slider
let currentSlide = 0;
const sliderWrapper = document.querySelector('.fl .slider-wrapper');
const slides = document.querySelectorAll('.fl .slider-item');
const totalSlides = slides.length;
const pagination = document.querySelector('.fl .pagination');
const sliderContainer = document.querySelector('.fl');

// Clone slides for infinite effect
function setupInfiniteSlider() {
    // Clone first and last slides
    const firstSlideClone = slides[0].cloneNode(true);
    const lastSlideClone = slides[totalSlides - 1].cloneNode(true);
    
    // Add clones to slider
    sliderWrapper.appendChild(firstSlideClone);
    sliderWrapper.insertBefore(lastSlideClone, slides[0]);
    
    // Set initial active slide
    slides[currentSlide].classList.add('active');
    
    // Create pagination dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('pagination-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        pagination.appendChild(dot);
    }
}

// Calculate center position with clones
function calculateTransform() {
    // Account for the cloned slide at the beginning
    const adjustedCurrentSlide = currentSlide + 1;
    
    // Calculate the offset to center the current slide
    const slideWidth = slides[0].offsetWidth;
    const wrapperWidth = sliderWrapper.offsetWidth;
    const centerOffset = (wrapperWidth - slideWidth) / 2;
    
    // Calculate the total transform value
    const transform = -(adjustedCurrentSlide * slideWidth) + centerOffset - (adjustedCurrentSlide * 2 * (slideWidth * 0.01));
    return transform;
}

// Slide function with infinite loop
function slide(direction) {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Update current slide index
    currentSlide = (currentSlide + direction) % totalSlides;
    
    // Handle negative index
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    // Add active class to new current slide
    slides[currentSlide].classList.add('active');
    
    // Handle the infinite loop transition
    updateSlider(direction);
}

// Go to specific slide
function goToSlide(index) {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Update current slide index
    currentSlide = index;
    
    // Add active class to new current slide
    slides[currentSlide].classList.add('active');
    
    updateSlider(0);
}

// Update slider position and active dot
function updateSlider(direction = 0) {
    // Calculate transform for wheel effect
    const transform = calculateTransform();
    
    // Apply transform
    sliderWrapper.style.transform = `translateX(${transform}px)`;
    
    // Update active dot
    document.querySelectorAll('.fl .pagination-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Handle the infinite loop animation
    if (direction !== 0) {
        // Check if we're at the end or beginning
        if (currentSlide === 0 && direction === -1) {
            // We went from first to last slide, handle loop
            setTimeout(() => {
                sliderWrapper.style.transition = 'none';
                currentSlide = totalSlides - 1;
                const newTransform = calculateTransform();
                sliderWrapper.style.transform = `translateX(${newTransform}px)`;
                setTimeout(() => {
                    sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }, 500);
        } else if (currentSlide === totalSlides - 1 && direction === 1) {
            // We went from last to first slide, handle loop
            setTimeout(() => {
                sliderWrapper.style.transition = 'none';
                currentSlide = 0;
                const newTransform = calculateTransform();
                sliderWrapper.style.transform = `translateX(${newTransform}px)`;
                setTimeout(() => {
                    sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }, 500);
        }
    }
}

// Call setup function
setupInfiniteSlider();

// Update slider on window resize
window.addEventListener('resize', () => updateSlider(0));

// Initial update
updateSlider(0);

// Auto-slide functionality
let slideInterval = setInterval(() => slide(1), 5000);

// Pause auto-slide when hovering
sliderContainer.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

sliderContainer.addEventListener('mouseleave', () => {
    slideInterval = setInterval(() => slide(1), 5000);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') slide(-1);
    else if (e.key === 'ArrowRight') slide(1);
});

// Swipe functionality for touch devices
let touchStartX = 0;
let touchEndX = 0;

sliderContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

sliderContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX + swipeThreshold < touchStartX) {
        slide(1); // Swipe left - next slide
    } else if (touchEndX > touchStartX + swipeThreshold) {
        slide(-1); // Swipe right - previous slide
    }
}

// Slide function with infinite loop
function slide(direction) {
    // Clear the auto-slide interval
    clearInterval(slideInterval);
    
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Update current slide index
    currentSlide = (currentSlide + direction) % totalSlides;
    
    // Handle negative index
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    // Add active class to new current slide
    slides[currentSlide].classList.add('active');
    
    // Handle the infinite loop transition
    updateSlider(direction);
    
    // Restart the auto-slide interval
    slideInterval = setInterval(() => slide(1), 5000);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        slide(-1);
        // Auto-slide is restarted inside the slide function
    }
    else if (e.key === 'ArrowRight') {
        slide(1);
        // Auto-slide is restarted inside the slide function
    }
});

// In your handleSwipe function
function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX + swipeThreshold < touchStartX) {
        slide(1); // Swipe left - next slide
        // Auto-slide is restarted inside the slide function
    } else if (touchEndX > touchStartX + swipeThreshold) {
        slide(-1); // Swipe right - previous slide
        // Auto-slide is restarted inside the slide function
    }
}

const scrollUpBtn = document.getElementById("scrollUpBtn");

window.onscroll = function () {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollUpBtn.style.display = "block";
    } else {
        scrollUpBtn.style.display = "none";
    }
};

scrollUpBtn.onclick = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

