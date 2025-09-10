document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const mainImageContainer = document.querySelector('.main-image-container');
    
    let currentIndex = 0;
    let startX = 0;
    let startY = 0;
    let isSwipeDetected = false;
    
    // Handle thumbnail clicks
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            const imageUrl = this.dataset.image;
            changeMainImage(imageUrl, index);
        });
    });
    
    // Touch events for swipe navigation on main image
    mainImageContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwipeDetected = false;
    });
    
    mainImageContainer.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Only detect horizontal swipes (ignore vertical scrolling)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
            isSwipeDetected = true;
            e.preventDefault(); // Prevent scrolling when swiping
        }
    });
    
    mainImageContainer.addEventListener('touchend', function(e) {
        if (!startX || !isSwipeDetected) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        // Minimum swipe distance
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next image
                nextImage();
            } else {
                // Swipe right - previous image  
                previousImage();
            }
        }
        
        startX = 0;
        startY = 0;
        isSwipeDetected = false;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            previousImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
    
    function changeMainImage(imageUrl, index) {
        mainImage.src = imageUrl;
        currentIndex = index;
        updateActiveThumbnail();
        scrollToActiveThumbnail();
    }
    
    function updateActiveThumbnail() {
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentIndex);
        });
    }
    
    function scrollToActiveThumbnail() {
        const activeThumbnail = thumbnails[currentIndex];
        const containerWidth = thumbnailContainer.offsetWidth;
        const thumbnailWidth = activeThumbnail.offsetWidth;
        const thumbnailOffsetLeft = activeThumbnail.offsetLeft;
        
        const scrollLeft = thumbnailOffsetLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        thumbnailContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        const nextImageUrl = thumbnails[currentIndex].dataset.image;
        changeMainImage(nextImageUrl, currentIndex);
    }
    
    function previousImage() {
        currentIndex = currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1;
        const prevImageUrl = thumbnails[currentIndex].dataset.image;
        changeMainImage(prevImageUrl, currentIndex);
    }
    
    // Add smooth scroll behavior for thumbnail container
    let isScrolling = false;
    thumbnailContainer.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // Initialize
    updateActiveThumbnail();
    
    // Offer section functionality
    initializeOfferSection();
    
    // Initialize accordion
    initializeAccordion();
});

function initializeOfferSection() {
    const sugarTabs = document.querySelectorAll('.sugar-tab');
    const flavorOptions = document.querySelectorAll('.flavor-option');
    const priceCards = document.querySelectorAll('.price-card');
    const pricingSets = document.querySelectorAll('.pricing-set');
    const benefitItems = document.querySelectorAll('.benefit-item');
    
    let currentFlavor = 'original';
    let currentPerson = 'one';
    
    // Sugar tabs functionality
    sugarTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            sugarTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Flavor options functionality
    flavorOptions.forEach(option => {
        option.addEventListener('click', function() {
            flavorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            currentFlavor = this.dataset.flavor;
            updatePricingDisplay();
            updateBenefitsDisplay();
        });
    });
    
    // Price card functionality
    priceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Only update selection within the same pricing set
            const parentSet = this.closest('.pricing-set');
            const siblingCards = parentSet.querySelectorAll('.price-card');
            
            siblingCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            currentPerson = this.dataset.person;
            updateBenefitsDisplay();
        });
    });
    
    function updatePricingDisplay() {
        // Hide all pricing sets
        pricingSets.forEach(set => set.classList.remove('active'));
        
        // Show current flavor pricing set
        const currentPricingSet = document.querySelector(`[data-flavor="${currentFlavor}"].pricing-set`);
        if (currentPricingSet) {
            currentPricingSet.classList.add('active');
            
            // Set the correct price card as active
            const priceCard = currentPricingSet.querySelector(`[data-person="${currentPerson}"].price-card`);
            if (priceCard) {
                currentPricingSet.querySelectorAll('.price-card').forEach(card => card.classList.remove('active'));
                priceCard.classList.add('active');
            }
        }
    }
    
    function updateBenefitsDisplay() {
        // Hide all benefit items except common ones
        benefitItems.forEach(item => {
            if (item.classList.contains('common')) {
                return; // Keep common items visible
            }
            item.classList.remove('active');
        });
        
        // Show current combination benefit
        const currentBenefit = document.querySelector(`[data-flavor="${currentFlavor}"][data-person="${currentPerson}"].benefit-item`);
        if (currentBenefit) {
            currentBenefit.classList.add('active');
        }
    }
    
    // Initialize display
    updatePricingDisplay();
    updateBenefitsDisplay();
}

function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-accordion');
            const targetContent = document.getElementById(targetId);
            const icon = this.querySelector('.accordion-icon');
            
            // Close all other accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherId = otherHeader.getAttribute('data-accordion');
                    const otherContent = document.getElementById(otherId);
                    const otherIcon = otherHeader.querySelector('.accordion-icon');
                    const otherItem = otherHeader.closest('.accordion-item');
                    
                    otherContent.classList.remove('active');
                    otherItem.classList.remove('open');
                    otherIcon.textContent = '+';
                }
            });
            
            // Toggle current accordion
            const currentItem = this.closest('.accordion-item');
            if (targetContent.classList.contains('active')) {
                targetContent.classList.remove('active');
                currentItem.classList.remove('open');
                icon.textContent = '+';
            } else {
                targetContent.classList.add('active');
                currentItem.classList.add('open');
                icon.textContent = '−';
            }
        });
    });
}

