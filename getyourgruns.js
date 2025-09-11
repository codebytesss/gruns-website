document.addEventListener('DOMContentLoaded', function () {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const mainImageContainer = document.querySelector('.main-image-container');

    let currentIndex = 0;
    let startX = 0;
    let startY = 0;
    let isSwipeDetected = false;
    
    // Image sets for different flavors
    const imageSets = {
        original: [
            'images/Lifestyle_01_-_Adults.png',
            'images/benefits_gallery_image.jpg',
            'images/Nutrition_Label_LS_-_Adults_B_V2_-_Desktop.png',
            'images/REBRAND_New_look_same_formula_Adults_Images_Image04_1.jpg',
            'images/Lifestyle_02-_Adults.png',
            'images/Lifestyle_03_-_Adults.png'
        ],
        grunny: [
            'images/gsa1.avif',
            'images/gsa2.webp',
            'images/gsa3.webp',
            'images/gsa4.webp',
            'images/gsa5.webp',
            'images/gsa6.webp'
        ]
    };
    
    let currentFlavor = 'original';

    // Handle thumbnail clicks
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function () {
            const imageUrl = this.dataset.image;
            changeMainImage(imageUrl, index);
        });
    });

    // Touch events for swipe navigation on main image
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

        // Only detect horizontal swipes (ignore vertical scrolling)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
            isSwipeDetected = true;
            e.preventDefault(); // Prevent scrolling when swiping
        }
    });

    mainImageContainer.addEventListener('touchend', function (e) {
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
    document.addEventListener('keydown', function (e) {
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
        const nextImageUrl = imageSets[currentFlavor][currentIndex];
        changeMainImage(nextImageUrl, currentIndex);
    }

    function previousImage() {
        currentIndex = currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1;
        const prevImageUrl = imageSets[currentFlavor][currentIndex];
        changeMainImage(prevImageUrl, currentIndex);
    }
    
    function updateImageGallery(newFlavor) {
        const newImageSet = imageSets[newFlavor];
        
        // Update all thumbnails
        thumbnails.forEach((thumbnail, index) => {
            if (newImageSet[index]) {
                thumbnail.dataset.image = newImageSet[index];
                const img = thumbnail.querySelector('img');
                if (img) {
                    img.src = newImageSet[index];
                }
            }
        });
        
        // Update main image to maintain current position
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
});

function initializeOfferSection() {
    const sugarTabs = document.querySelectorAll('.sugar-tab');
    const flavorOptions = document.querySelectorAll('.flavor-option');
    const priceCards = document.querySelectorAll('.price-card');
    const pricingSets = document.querySelectorAll('.pricing-set');
    const benefitItems = document.querySelectorAll('.benefit-item');

    let currentFlavor = 'original';
    let currentPerson = 'one';
    let currentSugarType = 'low';

    // Price data for different combinations
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
                two: { price: '$106.20', oldPrice: '$185.96', perDay: '$1.90', discount: '43%' }
            }
        }
    };

    // Sugar tabs functionality
    sugarTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            sugarTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            currentSugarType = this.dataset.sugar;
            console.log('Sugar type changed to:', currentSugarType);
            updatePricing();
        });
    });

    // Flavor options functionality
    flavorOptions.forEach(option => {
        option.addEventListener('click', function () {
            flavorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');

            const newFlavor = this.dataset.flavor;
            currentFlavor = newFlavor;
            
            // Update image gallery
            if (window.updateImageGallery) {
                window.updateImageGallery(newFlavor);
            }
            
            updatePricing();
            updatePricingDisplay();
            updateBenefitsDisplay();
        });
    });

    // Price card functionality
    priceCards.forEach(card => {
        card.addEventListener('click', function () {
            // Only update selection within the same pricing set
            const parentSet = this.closest('.pricing-set');
            const siblingCards = parentSet.querySelectorAll('.price-card');

            siblingCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            currentPerson = this.dataset.person;
            updateBenefitsDisplay();
        });
    });

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
    updatePricing();
    updatePricingDisplay();
    updateBenefitsDisplay();
}

function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
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

