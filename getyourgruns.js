// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get the main app container to scope all queries and avoid conflicts
    const appContainer = document.querySelector('.gruns-main-app');
    if (!appContainer) {
        console.error('Gruns main app container not found');
        return;
    }
    
    // Get image gallery elements
    const mainImage = document.getElementById('mainImage');
    const thumbnails = appContainer.querySelectorAll('.thumbnail');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const mainImageContainer = appContainer.querySelector('.main-image-container');

    // Ensure critical elements exist before proceeding
    if (!mainImage || !mainImageContainer || thumbnails.length === 0) {
        console.error('Critical elements not found for Gruns functionality');
        return;
    }

    // Variables for image navigation and touch handling
    let currentIndex = 0;
    let startX = 0;
    let startY = 0;
    let isSwipeDetected = false;

    // Image sets for different flavors - used when user switches flavors
    const imageSets = {
        original: [
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/OG-Adults-GalleryImage1-LS_2x_08fc8ca9-20d8-4570-add6-67b9df1e6dc3.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/Nutrition_Label_LS_-_Adults_B_V2_-_Desktop.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/NewLookSameFormula_1x_df5a93e1-e5a5-4e81-bed2-e8be6ba2642e.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/Lifestyle_01_-_Adults.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/Lifestyle_02_-_Adults.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/Lifestyle_03_-_Adults.webp?&width=600'
        ],
        grunny: [
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/galleryimage01-LS_2x_fe9547b5-9072-4a91-bae7-d31736db917f.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/galleryimage02-LS_2x_56447469-9625-4b11-b44a-ace557c6dfe1.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/galleryimage07-LS_2x_f1cf074f-8a60-4e59-b230-e4206722fbd8.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/galleryimage03_2x_c4e00927-5b75-44a2-910a-db76748a0dc2.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/galleryimage04_2x_01981aca-de14-409b-bde4-c584ed1cfc5a.webp?&width=600',
            'https://cdn.shopify.com/s/files/1/0550/9614/8034/files/galleryimage05_2x_d345729b-4af4-4da5-9dfd-67b986b74159.webp?&width=600'
        ]
    };

    let currentFlavor = 'original';

    // Handle thumbnail clicks to change main image
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function () {
            const imageUrl = this.dataset.image;
            changeMainImage(imageUrl, index);
        });
    });

    // Touch events for mobile swipe navigation on main image
    mainImageContainer.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwipeDetected = false;
    });

    mainImageContainer.addEventListener('touchmove', function (e) {
        if (!startX || !startY) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;

        // Only detect horizontal swipes to avoid interfering with vertical scrolling
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
            isSwipeDetected = true;
            e.preventDefault(); // Prevent page scroll during horizontal swipe
        }
    });

    mainImageContainer.addEventListener('touchend', function (e) {
        if (!startX || !isSwipeDetected) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        // Require minimum swipe distance to prevent accidental triggers
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

    // Keyboard navigation for accessibility
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            previousImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });

    // Update main image and thumbnail states
    function changeMainImage(imageUrl, index) {
        mainImage.src = imageUrl;
        currentIndex = index;
        updateActiveThumbnail();
        scrollToActiveThumbnail();
    }

    // Update visual state of thumbnails to show which is active
    function updateActiveThumbnail() {
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentIndex);
        });
    }

    // Auto-scroll thumbnail container to keep active thumbnail visible
    function scrollToActiveThumbnail() {
        const activeThumbnail = thumbnails[currentIndex];
        const containerWidth = thumbnailContainer.offsetWidth;
        const thumbnailWidth = activeThumbnail.offsetWidth;
        const thumbnailOffsetLeft = activeThumbnail.offsetLeft;

        // Center the active thumbnail in the container
        const scrollLeft = thumbnailOffsetLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        thumbnailContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        const nextImageUrl = imageSets[currentFlavor][currentIndex];
        changeMainImage(nextImageUrl, currentIndex);
    }

    function previousImage() {
        currentIndex = currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1;
        const prevImageUrl = imageSets[currentFlavor][currentIndex];
        changeMainImage(prevImageUrl, currentIndex);
    }

    // Switch image gallery when flavor changes (called from offer section)
    function updateImageGallery(newFlavor) {
        const newImageSet = imageSets[newFlavor];

        // Update all thumbnail images and data attributes
        thumbnails.forEach((thumbnail, index) => {
            if (newImageSet[index]) {
                thumbnail.dataset.image = newImageSet[index];
                const img = thumbnail.querySelector('img');
                if (img) {
                    img.src = newImageSet[index];
                }
            }
        });

        // Update main image while keeping same position in gallery
        const newMainImageUrl = newImageSet[currentIndex];
        if (newMainImageUrl) {
            mainImage.src = newMainImageUrl;
        }

        currentFlavor = newFlavor;
    }

    // Add smooth scroll behavior for thumbnail container
    let isScrolling = false;
    thumbnailContainer.addEventListener('scroll', function () {
        if (!isScrolling) {
            window.requestAnimationFrame(function () {
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Initialize
    updateActiveThumbnail();

    // Make updateImageGallery available globally
    window.updateImageGallery = updateImageGallery;


    // Offer section functionality
    initializeOfferSection();

    // Initialize accordion
    initializeAccordion();

    // Initialize try once toggle
    initializeTryOnceToggle();
});

// Initialize the offer section with pricing, flavors, and sugar options
function initializeOfferSection() {
    // Scope all queries to avoid conflicts with other page elements
    const appContainer = document.querySelector('.gruns-main-app');
    if (!appContainer) {
        console.error('Gruns main app container not found in offer section');
        return;
    }
    
    // Get all interactive elements in the offer section
    const sugarTabs = appContainer.querySelectorAll('.sugar-tab');
    const flavorOptions = appContainer.querySelectorAll('.flavor-option');
    const priceCards = appContainer.querySelectorAll('.price-card');
    const pricingSets = appContainer.querySelectorAll('.pricing-set');
    const benefitItems = appContainer.querySelectorAll('.benefit-item');

    // Ensure critical elements exist
    if (!sugarTabs.length || !flavorOptions.length) {
        console.error('Critical offer section elements not found');
        return;
    }

    let currentFlavor = 'original';
    let currentPerson = 'one';
    let currentSugarType = 'low';

    // Price data for different sugar/flavor combinations
    const priceData = {
        low: {
            original: {
                one: { price: '$48.00', oldPrice: '$79.99', perDay: '$1.71', discount: '40%' },
                two: { price: '$91.20', oldPrice: '$159.98', perDay: '$1.63', discount: '43%' }
            },
            grunny: {
                one: { price: '$51.00', oldPrice: '$84.98', perDay: '$1.82', discount: '40%' },
                two: { price: '$96.90', oldPrice: '$169.96', perDay: '$1.73', discount: '43%' }
            }
        },
        free: {
            original: {
                one: { price: '$52.80', oldPrice: '$87.99', perDay: '$1.89', discount: '40%' },
                two: { price: '$100.32', oldPrice: '$175.98', perDay: '$1.79', discount: '43%' }
            },
            grunny: {
                one: { price: '$55.80', oldPrice: '$92.98', perDay: '$1.99', discount: '40%' },
                two: { price: '$106.02', oldPrice: '$185.96', perDay: '$1.89', discount: '43%' }
            }
        }
    };

    // One-time purchase pricing (no subscription)
    const tryOnceData = {
        low: {
            original: {
                price: '$64.00',
                oldPrice: '$79.99',
                perDay: '$2.29'
            },
            grunny: {
                price: '$67.98',
                oldPrice: '$84.98',
                perDay: '$2.43'
            }
        },
        free: {
            original: {
                price: '$70.40',
                oldPrice: '$87.99',
                perDay: '$2.51'
            },
            grunny: {
                price: '$74.39',
                oldPrice: '$92.98',
                perDay: '$2.65'
            }
        }
    };

    // Handle sugar tab switching (Low Sugar vs Sugar Free)
    sugarTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            sugarTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            currentSugarType = this.dataset.sugar;
            console.log('Sugar type changed to:', currentSugarType);
            updatePricing();
            updateTryOncePricing();
        });
    });

    // Handle flavor selection (Original vs Grünny Smith Apple)
    flavorOptions.forEach(option => {
        option.addEventListener('click', function () {
            flavorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');

            const newFlavor = this.dataset.flavor;
            currentFlavor = newFlavor;

            // Update image gallery to show new flavor images
            if (window.updateImageGallery) {
                window.updateImageGallery(newFlavor);
            }

            // Update all pricing and content for new flavor
            updatePricing();
            updatePricingDisplay();
            updateBenefitsDisplay();
            updateTryOncePricing();
        });
    });

    // Handle price card selection (One Person vs Two People)
    priceCards.forEach(card => {
        card.addEventListener('click', function () {
            // Only update selection within the same pricing set (flavor)
            const parentSet = this.closest('.pricing-set');
            const siblingCards = parentSet.querySelectorAll('.price-card');

            siblingCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            currentPerson = this.dataset.person;
            updateBenefitsDisplay(); // Update benefits text based on selection
        });
    });

    // Update displayed prices based on current sugar type and flavor
    function updatePricing() {
        console.log('updatePricing called with:', currentSugarType, currentFlavor);
        const pricing = priceData[currentSugarType][currentFlavor];
        console.log('Pricing data:', pricing);

        pricingSets.forEach(set => {
            if (set.dataset.flavor === currentFlavor) {
                const onePersonCard = set.querySelector('[data-person="one"]');
                const twoPersonCard = set.querySelector('[data-person="two"]');

                if (onePersonCard && pricing.one) {
                    const priceElement = onePersonCard.querySelector('.price');
                    const perDayElement = onePersonCard.querySelector('.per-day');
                    const discountElement = onePersonCard.querySelector('.discount-badge');

                    if (priceElement) {
                        priceElement.innerHTML = `${pricing.one.price} <span class="old-price">${pricing.one.oldPrice}</span>`;
                    }
                    if (perDayElement) {
                        perDayElement.textContent = `${pricing.one.perDay} Per Day`;
                    }
                    if (discountElement) {
                        discountElement.textContent = `${pricing.one.discount} off`;
                    }
                }

                if (twoPersonCard && pricing.two) {
                    const priceElement = twoPersonCard.querySelector('.price');
                    const perDayElement = twoPersonCard.querySelector('.per-day');
                    const discountElement = twoPersonCard.querySelector('.discount-badge');

                    if (priceElement) {
                        priceElement.innerHTML = `${pricing.two.price} <span class="old-price">${pricing.two.oldPrice}</span>`;
                    }
                    if (perDayElement) {
                        perDayElement.textContent = `${pricing.two.perDay} Per Day`;
                    }
                    if (discountElement) {
                        discountElement.textContent = `${pricing.two.discount} off`;
                    }
                }
            }
        });
    }

    // Show/hide pricing sets based on selected flavor
    function updatePricingDisplay() {
        // Hide all pricing sets first
        pricingSets.forEach(set => set.classList.remove('active'));

        // Show pricing set for current flavor
        const currentPricingSet = appContainer.querySelector(`[data-flavor="${currentFlavor}"].pricing-set`);
        if (currentPricingSet) {
            currentPricingSet.classList.add('active');

            // Ensure correct price card remains selected
            const priceCard = currentPricingSet.querySelector(`[data-person="${currentPerson}"].price-card`);
            if (priceCard) {
                currentPricingSet.querySelectorAll('.price-card').forEach(card => card.classList.remove('active'));
                priceCard.classList.add('active');
            }
        }
    }

    // Update benefits list based on current flavor and person selection
    function updateBenefitsDisplay() {
        // Hide flavor/person-specific benefits, keep common ones visible
        benefitItems.forEach(item => {
            if (item.classList.contains('common')) {
                return; // Keep common benefits always visible
            }
            item.classList.remove('active');
        });

        // Show benefit specific to current flavor and person count
        const currentBenefit = appContainer.querySelector(`[data-flavor="${currentFlavor}"][data-person="${currentPerson}"].benefit-item`);
        if (currentBenefit) {
            currentBenefit.classList.add('active');
        }
    }

    // Update one-time purchase pricing
    function updateTryOncePricing() {
        const tryOnceCard = appContainer.querySelector('.try-once-card');
        if (!tryOnceCard) return;

        const pricing = tryOnceData[currentSugarType][currentFlavor];
        if (!pricing) return;

        const priceElement = tryOnceCard.querySelector('.price');
        const perDayElement = tryOnceCard.querySelector('.per-day');

        if (priceElement) {
            priceElement.innerHTML = `${pricing.price} <span class="old-price">${pricing.oldPrice}</span>`;
        }
        if (perDayElement) {
            perDayElement.textContent = `${pricing.perDay} Per Day`;
        }
    }

    // Initialize display
    updatePricing();
    updatePricingDisplay();
    updateBenefitsDisplay();
    updateTryOncePricing();
}

// Initialize accordion functionality (FAQ sections)
function initializeAccordion() {
    // Scope queries to avoid conflicts
    const appContainer = document.querySelector('.gruns-main-app');
    if (!appContainer) {
        console.error('Gruns main app container not found in accordion');
        return;
    }
    
    const accordionHeaders = appContainer.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const targetId = this.getAttribute('data-accordion');
            const targetContent = document.getElementById(targetId);
            const icon = this.querySelector('.accordion-icon');

            // Close all other accordions (only one open at a time)
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

// Initialize try once card toggle functionality
function initializeTryOnceToggle() {
    // Scope check for safety
    const appContainer = document.querySelector('.gruns-main-app');
    if (!appContainer) {
        console.error('Gruns main app container not found in try once toggle');
        return;
    }
    
    const tryOnceCard = document.getElementById('tryOnceCard');
    
    // Toggle expanded state to show/hide additional info
    if (tryOnceCard) {
        tryOnceCard.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    }
}


