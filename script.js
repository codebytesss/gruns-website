// Grüns website functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the floating Try Grüns button
    const floatingButton = document.getElementById('floatingTryGruns');
    
    // Function to handle scroll events
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show button after scrolling down 100px from top
        if (scrollTop > 100) {
            floatingButton.classList.add('show');
        } else {
            floatingButton.classList.remove('show');
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check in case page is already scrolled
    handleScroll();
    
    console.log('Grüns website loaded');
});