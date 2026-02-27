/**
 * Main script - Initialize the tabs plugin
 */
$(document).ready(function() {
    
    // Initialize tabs with custom options
    $('#myTabs').tabify({
        activeClass: 'active',
        animation: 'slide',      // Options: 'fade', 'slide', 'none'
        speed: 400,
        defaultTab: 0,           // Start with first tab (Home)
        
        // Callback function when tab changes
        onTabChange: function($tab, $panel) {
            console.log('Switched to:', $tab.text());
            
            // Update page title
            document.title = $tab.text() + ' - jQuery Tabs Demo';
            
            // Optional: Add visual feedback
            $tab.css('transform', 'scale(1.05)');
            setTimeout(() => {
                $tab.css('transform', '');
            }, 200);
        }
    });
    
    // Example: Using multiple instances with different settings
    // You can add more tabs components with different IDs
    
    // Example of programmatically switching tabs
    // $('#myTabs').find('.tab-link').eq(1).trigger('click'); // Switch to About tab after 3 seconds
    
    setTimeout(function() {
        console.log('Tabs initialized successfully!');
        console.log('Try using arrow keys to navigate between tabs');
        console.log('You can bookmark specific tabs using the URL hash');
    }, 500);
});