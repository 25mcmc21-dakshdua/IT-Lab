/**
 * jQuery Tabify Plugin - Simple Tabbed Navigation
 * Version: 1.0
 */
(function($) {
    'use strict';

    // Plugin definition
    $.fn.tabify = function(options) {
        
        // Default settings
        const settings = $.extend({
            activeClass: 'active',
            animation: 'fade',    // 'fade', 'slide', or 'none'
            speed: 400,
            defaultTab: 0,         // Index of default tab (0-based)
            onTabChange: null      // Callback function
        }, options);

        // Loop through each matched element
        return this.each(function() {
            const $tabs = $(this);
            const $tabLinks = $tabs.find('.tab-link');
            const $tabPanels = $tabs.find('.tab-panel');
            
            // Store active tab index
            let activeIndex = settings.defaultTab;
            
            // Check URL hash for deep linking
            if (window.location.hash) {
                const hash = window.location.hash;
                const $linkedTab = $tabs.find(`.tab-link[href="${hash}"]`);
                
                if ($linkedTab.length) {
                    activeIndex = $tabLinks.index($linkedTab);
                }
            }
            
            // Function to activate a tab
            function activateTab(index) {
                if (index < 0 || index >= $tabLinks.length) return;
                
                const $newTab = $tabLinks.eq(index);
                const targetId = $newTab.attr('href');
                
                // Update active states
                $tabLinks.removeClass(settings.activeClass);
                $newTab.addClass(settings.activeClass);
                
                // Handle animation
                $tabPanels.hide();
                
                if (settings.animation !== 'none') {
                    $(targetId).addClass(settings.animation).show();
                    
                    // Remove animation class after it completes
                    setTimeout(() => {
                        $(targetId).removeClass(settings.animation);
                    }, settings.speed);
                } else {
                    $(targetId).show();
                }
                
                // Update URL hash for bookmarking
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
                
                // Update active index
                activeIndex = index;
                
                // Callback
                if ($.isFunction(settings.onTabChange)) {
                    settings.onTabChange($newTab, $(targetId));
                }
            }
            
            // Click event handler
            $tabs.on('click', '.tab-link', function(e) {
                e.preventDefault();
                const index = $tabLinks.index($(this));
                activateTab(index);
            });
            
            // Keyboard navigation
            $tabs.on('keydown', '.tab-link', function(e) {
                let newIndex;
                
                // Left arrow
                if (e.which === 37) {
                    e.preventDefault();
                    newIndex = activeIndex - 1;
                    if (newIndex < 0) newIndex = $tabLinks.length - 1;
                    activateTab(newIndex);
                    $tabLinks.eq(newIndex).focus();
                }
                
                // Right arrow
                if (e.which === 39) {
                    e.preventDefault();
                    newIndex = activeIndex + 1;
                    if (newIndex >= $tabLinks.length) newIndex = 0;
                    activateTab(newIndex);
                    $tabLinks.eq(newIndex).focus();
                }
            });
            
            // Handle browser back/forward buttons
            $(window).on('popstate', function() {
                if (window.location.hash) {
                    const hash = window.location.hash;
                    const $linkedTab = $tabs.find(`.tab-link[href="${hash}"]`);
                    
                    if ($linkedTab.length) {
                        activateTab($tabLinks.index($linkedTab));
                    }
                }
            });
            
            // Initialize with default tab
            activateTab(activeIndex);
            
            // Set ARIA attributes for accessibility
            $tabLinks.attr('aria-selected', 'false');
            $tabPanels.attr('aria-hidden', 'true');
            
            $tabLinks.eq(activeIndex).attr('aria-selected', 'true');
            $tabPanels.eq(activeIndex).attr('aria-hidden', 'false');
            
            // Update ARIA attributes on tab change
            $tabs.on('tabActivated', function(e, index) {
                $tabLinks.attr('aria-selected', 'false');
                $tabPanels.attr('aria-hidden', 'true');
                
                $tabLinks.eq(index).attr('aria-selected', 'true');
                $tabPanels.eq(index).attr('aria-hidden', 'false');
            });
        });
    };

}(jQuery));