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
});