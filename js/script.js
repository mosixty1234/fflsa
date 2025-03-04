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

document.addEventListener("DOMContentLoaded", function () {
    // Function to toggle dropdown visibility
    function toggleDropdown(dropdownId) {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.classList.toggle("active");
      }
    }
  
    // Select all dropdown buttons and add click event listeners
    document.querySelectorAll(".dropdown-toggle").forEach(button => {
      button.addEventListener("click", function () {
        const dropdownId = this.getAttribute("data-dropdown");
        toggleDropdown(dropdownId);
      });
    });
  });

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
document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.querySelector('.fl');

    // Only initialize if the slider exists on the page
    if (!sliderContainer) return;

    let currentSlide = 0;
    const sliderWrapper = document.querySelector('.fl .slider-wrapper');
    const slides = document.querySelectorAll('.fl .slider-item'); // Fixed typo: .slider-item
    const pagination = document.querySelector('.fl .pagination');

    // Get slider navigation buttons based on the actual HTML
    const prevButton = document.querySelector('.fl .slider-prev');
    const nextButton = document.querySelector('.fl .slider-next');

    // Check if required elements exist
    if (!sliderWrapper || !slides.length) {
        console.error('Missing required slider elements');
        return;
    }

    const totalSlides = slides.length;
    let slideInterval;
    let isAnimating = false; // Flag to prevent multiple rapid clicks

    // Define slide function globally to be accessible via onclick attribute
    window.slide = function (direction) {
        if (isAnimating) return; // Prevent rapid clicking

        isAnimating = true;

        // Clear the auto-slide interval
        clearInterval(slideInterval);

        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');

        // Update current slide index
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

        // Add active class to new current slide
        slides[currentSlide].classList.add('active');

        // Handle the infinite loop transition
        updateSlider(direction);

        // Restart the auto-slide interval
        startAutoSlide();

        // Reset animation flag after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    };

    // Clone slides for infinite effect
    function setupInfiniteSlider() {
        // Check if slides exist before cloning
        if (slides.length === 0) {
            console.error('No slides found to initialize slider');
            return;
        }

        // Clone first and last slides
        const firstSlideClone = slides[0].cloneNode(true);
        const lastSlideClone = slides[totalSlides - 1].cloneNode(true);

        // Add clone identifiers for debugging
        firstSlideClone.setAttribute('data-clone', 'first');
        lastSlideClone.setAttribute('data-clone', 'last');

        // Add clones to slider
        sliderWrapper.appendChild(firstSlideClone);
        sliderWrapper.insertBefore(lastSlideClone, slides[0]);

        // Set initial position after clones are added
        sliderWrapper.style.transition = 'none';
        sliderWrapper.style.transform = `translateX(${calculateTransform()}px)`;

        // Force reflow before adding transition back
        void sliderWrapper.offsetWidth;
        sliderWrapper.style.transition = 'transform 0.5s ease-in-out';

        // Set initial active slide
        slides[currentSlide].classList.add('active');

        // Create pagination dots if pagination element exists
        if (pagination) {
            pagination.innerHTML = ''; // Clear existing dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('pagination-dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-current', 'true');
                }
                dot.addEventListener('click', () => goToSlide(i));
                pagination.appendChild(dot);
            }
        }
    }

    // Calculate center position with clones
    function calculateTransform() {
        // Account for the cloned slide at the beginning
        const adjustedCurrentSlide = currentSlide + 1;

        // Calculate the offset to center the current slide
        const slideWidth = slides[0]?.offsetWidth || 0;
        const wrapperWidth = sliderContainer?.offsetWidth || 0;
        const centerOffset = (wrapperWidth - slideWidth) / 2;

        // Calculate the total transform value (simplified calculation)
        return -(adjustedCurrentSlide * slideWidth) + centerOffset;
    }

    // Go to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides || isAnimating) return;

        isAnimating = true;

        // Remove active class from current slide and pagination dot
        slides[currentSlide].classList.remove('active');

        // Update current slide index
        currentSlide = index;

        // Add active class to new current slide
        slides[currentSlide].classList.add('active');

        updateSlider(0);

        // Reset animation flag after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Update slider position and active dot
    function updateSlider(direction = 0) {
        // Calculate transform
        const transform = calculateTransform();

        // Apply transform
        sliderWrapper.style.transform = `translateX(${transform}px)`;

        // Update active dot if pagination exists
        if (pagination) {
            const dots = document.querySelectorAll('.fl .pagination-dot');
            dots.forEach((dot, index) => {
                const isActive = index === currentSlide;
                dot.classList.toggle('active', isActive);
                if (isActive) {
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.removeAttribute('aria-current');
                }
            });
        }

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

                    // Force reflow before adding transition back
                    void sliderWrapper.offsetWidth;
                    sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
                }, 500);
            } else if (currentSlide === totalSlides - 1 && direction === 1) {
                // We went from last to first slide, handle loop
                setTimeout(() => {
                    sliderWrapper.style.transition = 'none';
                    currentSlide = 0;
                    const newTransform = calculateTransform();
                    sliderWrapper.style.transform = `translateX(${newTransform}px)`;

                    // Force reflow before adding transition back
                    void sliderWrapper.offsetWidth;
                    sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
                }, 500);
            }
        }
    }

    // Start auto-slide functionality
    function startAutoSlide() {
        // Clear any existing interval first
        clearInterval(slideInterval);
        slideInterval = setInterval(() => slide(1), 5000);
    }

    // Swipe functionality for touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX + swipeThreshold < touchStartX) {
            slide(1); // Swipe left - next slide
        } else if (touchEndX > touchStartX + swipeThreshold) {
            slide(-1); // Swipe right - previous slide
        }
    }

    // Set up event listeners for other functionality
    function setupEventListeners() {
        // Add click handlers for navigation buttons
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                slide(-1);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                slide(1);
            });
        }

        // Pause auto-slide when hovering
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        sliderContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') slide(-1);
            else if (e.key === 'ArrowRight') slide(1);
        });

        // Touch events for swipe
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        // Handle transition end to reset animation state
        sliderWrapper.addEventListener('transitionend', function () {
            isAnimating = false;
        });
    }

    // Initialize everything
    try {
        setupInfiniteSlider();
        setupEventListeners();

        // Initial update
        updateSlider(0);

        // Start auto-slide
        startAutoSlide();

        // Update slider on window resize with debounce
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                updateSlider(0);
            }, 250);
        });

        console.log('Slider initialized successfully');
    } catch (error) {
        console.error('Error initializing slider:', error.message, error.stack);
    }
});

// Immediate execution function to ensure code runs
(function () {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filterValue = this.getAttribute('data-filter');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // Load more button functionality (placeholder)
    const loadMoreBtn = document.querySelector('.load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            alert('Load more functionality would be implemented here.');
            // In a real implementation, this would load more images via AJAX
        });
    }
})();


// One-time Donation Function
function redirectToPayFast() {
    const donationAmount = Number(document.getElementById("donationAmount").value.trim());
    if (isNaN(donationAmount) || donationAmount < 50 || donationAmount > 1000000) {
        alert("Please enter a valid donation amount between R50 and R1,000,000.");
        return;
    }

    let existingForm = document.getElementById("payfastForm");
    if (existingForm) existingForm.remove();

    const form = document.createElement("form");
    form.id = "payfastForm";
    form.method = "POST";
    form.action = "https://sandbox.payfast.co.za/eng/process";

    form.innerHTML = `
        <input type="hidden" name="merchant_id" value="10037375">
        <input type="hidden" name="merchant_key" value="vvl2itlcfwjfi">
        <input type="hidden" name="amount" value="${donationAmount * 100}">
        <input type="hidden" name="item_name" value="Food For Life Donation">
        <input type="hidden" name="return_url" value="https://yourwebsite.com/payment-success">
        <input type="hidden" name="cancel_url" value="https://yourwebsite.com/payment-cancelled">
        <input type="hidden" name="notify_url" value="https://yourwebsite.com/payment-notify">
    `;

    try {
        document.body.appendChild(form);
        document.body.style.cursor = "wait";
        form.submit();
    } catch (error) {
        alert("An error occurred. Please try again.");
        console.error(error);
    }
}

// Subscription Function
function subscribeToPayFast(amount) {
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 50 || parsedAmount > 1000000) {
        alert("Please select a valid donation amount between R50 and R1,000,000.");
        return;
    }

    let existingForm = document.getElementById("payfastSubscriptionForm");
    if (existingForm) existingForm.remove();

    const form = document.createElement("form");
    form.id = "payfastSubscriptionForm";
    form.method = "POST";
    form.action = "https://sandbox.payfast.co.za/eng/process";

    form.innerHTML = `
        <input type="hidden" name="merchant_id" value="10037375">
        <input type="hidden" name="merchant_key" value="vvl2itlcfwjfi">
        <input type="hidden" name="amount" value="${parsedAmount * 100}">
        <input type="hidden" name="recurring_amount" value="${parsedAmount * 100}">
        <input type="hidden" name="item_name" value="Monthly Donation Subscription">
        <input type="hidden" name="subscription_type" value="1">
        <input type="hidden" name="frequency" value="3">
        <input type="hidden" name="cycles" value="0">
        <input type="hidden" name="return_url" value="https://yourwebsite.com/subscription-success">
        <input type="hidden" name="cancel_url" value="https://yourwebsite.com/subscription-cancelled">
        <input type="hidden" name="notify_url" value="https://yourwebsite.com/subscription-notify">
    `;

    try {
        document.body.appendChild(form);
        document.body.style.cursor = "wait";
        form.submit();
    } catch (error) {
        alert("An error occurred while processing your subscription. Please try again.");
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".timeline-item");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dateDisplay = document.querySelector(".date-display");

    let currentIndex = 0;

    function updateTimeline() {
        items.forEach((item, index) => {
            item.classList.toggle("active", index === currentIndex);
        });

        dateDisplay.textContent = items[currentIndex].dataset.date;
    }

    prevBtn.addEventListener("click", function () {
        currentIndex = (currentIndex === 0) ? items.length - 1 : currentIndex - 1;
        updateTimeline();
    });

    nextBtn.addEventListener("click", function () {
        currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
        updateTimeline();
    });

    updateTimeline();
});

