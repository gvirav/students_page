$(document).ready(function(){

    var debug = !!(window && window.location && window.location.hostname && window.location.hostname == "127.0.0.1");
    var supportsCSSAnimations = function(){
        var tmpElement = document.createElement("div");
        var feature = "AnimationName";
        var properties = [feature];
        var prefixes = ["Webkit", "Moz", "I", "ms", "Khtml"];

        for (var i = 0; i < prefixes.length; i++) {
            properties.push(prefixes[i] + feature);
        }

        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];

            if (typeof tmpElement.style[property] !== "undefined") {
                return true;
            }
        }

        return false;
    }();

    var _scrollbarWidth = null;
    var scrollbarWidth = function() {
        if (_scrollbarWidth != null)
            return _scrollbarWidth;

        var body = $("body"),
            initialValue = body.css("overflow-y");

        // Has Scrollbar
        body.css("overflow-y", "scroll");
        withScrollbar = $('body').innerWidth();

        // Does not have
        body.css("overflow-y", "hidden")
        withoutScrollbar = $('body').innerWidth()

        // Reset to initial
        body.css("overflow-y", initialValue);

        _scrollbarWidth = withoutScrollbar - withScrollbar;

        return _scrollbarWidth;
    };
    var enableScrolling = function(shouldEnable) {
        var currentScrollbarWidth = scrollbarWidth();

        if ($.browser.msie) {
            $("html").css("overflow", shouldEnable ? "auto" : "hidden");
        }
        $("body").css("overflow", shouldEnable ? "auto" : "hidden");
        $("body").css("margin-right", shouldEnable ? "auto" : currentScrollbarWidth);
    }

    // This is a huge hack to remove a pixel on the signin button in Firefox
    if (jQuery.browser['mozilla']) {
      $("body").addClass('mozilla');
    }

    // Account dropdown
    $("div.account-dropdown-view a.account").click(function(event){
        event.preventDefault();
        var selector = "div.account-dropdown-view",
            clickEvent = "click.account_dropdown_view_global_click";

        if ($(selector).hasClass("shown"))
          hideSubmenu(selector, clickEvent);
        else
          showSubmenu(selector, clickEvent);
    });
    var showSubmenu = function(selector, clickEvent) {
        $(selector).addClass("shown");

        // Global click handler, so we can hide the menu on a click,
        // but on a slight delay so it doesnt fire on the same click
        // which created this event
        setTimeout(function(){
            $(document).bind(clickEvent, hideSubmenu);
        }, 100);
    };
    var hideSubmenu = function(selector, clickEvent) {
        $(selector).removeClass("shown");
        $(document).unbind(clickEvent);
    };

    // Country settings
    var animationDuration = 400;
    var countryDropdownView = $("div.country-dropdown-view");
    var selectButton = $("a.select", countryDropdownView);

    var overlay = $("div.country-dropdown-overlay");

    overlay.click(function(event){

        // Enable scrolling
        enableScrolling(true);

        // Prepare
        countryDropdownPopover.addClass("hide-animation");

        var animationEnd = function() {
            $("div.country-dropdown-overlay").hide();
            countryDropdownPopover.hide();
            countryDropdownPopover.removeClass("hide-animation");

            $(overlay).off("webkitTransitionEnd");
            $(overlay).off("oTransitionEnd");
            $(overlay).off("transitionend");
        };

        $(overlay).on("webkitTransitionEnd", animationEnd);
        $(overlay).on("oTransitionEnd", animationEnd);
        $(overlay).on("transitionend", animationEnd);

        // Run animations
        // Ludwig: this one requires a timeout in firefox for some reason.
        setTimeout(function(){
            countryDropdownPopover.removeClass("shown");
            overlay.removeClass("shown");
        }, 50);

        if (!supportsCSSAnimations) {
            setTimeout(animationEnd, 0.0);
        }
    });

    var topSpacing = 16;
    var arrowSize = {"width": 26, "height": 17};
    var countryDropdownPopover = $("div.popover", countryDropdownView);

    selectButton.click(function(event){
        event.preventDefault();

        // Disable scrolling
        enableScrolling(false);

        // Add overlay to DOM
        overlay.show();

        // Position popover
        var popoverHeight = countryDropdownPopover.outerHeight();

        // Prepare
        countryDropdownPopover.show()
        countryDropdownPopover.css("top", -(popoverHeight + topSpacing));
        countryDropdownPopover.addClass("show-animation");

        // Position arrow
        var selectButtonWidth = selectButton.outerWidth();
        $("div.arrow", countryDropdownPopover).css("left", 20 + (selectButtonWidth / 2) - (arrowSize.width / 2));

        // Animation origin
        var origin = {
            "x": 20 + (selectButtonWidth / 2),
            "y": popoverHeight + (arrowSize.height - 7)
        }
        countryDropdownPopover.css("-webkit-transform-origin", origin.x + "px " + origin.y + "px");
        countryDropdownPopover.css("-moz-transform-origin", origin.x + "px " + origin.y + "px");

        var animationEnd = function() {
            countryDropdownPopover.removeClass("show-animation");

            $(overlay).off("webkitTransitionEnd");
            $(overlay).off("oTransitionEnd");
            $(overlay).off("transitionend");
        };

        $(overlay).on("webkitTransitionEnd", animationEnd);
        $(overlay).on("oTransitionEnd", animationEnd);
        $(overlay).on("transitionend", animationEnd);

        // Run animations
        countryDropdownPopover.addClass("shown");
        overlay.addClass("shown");

        if (!supportsCSSAnimations) {
            setTimeout(animationEnd, animationDuration);
        }
    });
    
    
    // @2x helpers
    // ---
    // Ludwig: Check if we have already run the 2x things,
    //         it happens if people accidentally include shared.js twice,
    //         and instead of removing those, I fix it here because it will
    //         still happen in the future.
    if (typeof(window["currentPixelRatio"]) != "undefined") {
        return;
    }
    
    var currentPixelRatio = function() {
        return (typeof(window["devicePixelRatio"]) != "undefined") ? window.devicePixelRatio : 1;
    }
    window.currentPixelRatio = currentPixelRatio;

    var hiResURL = function(src, pixelRatio) {
        if (pixelRatio == 2) {
            var srcParts = src.split(".");
            if (srcParts.length > 1) {
              srcParts[srcParts.length - 2] += "@2x";
            }
            return srcParts.join(".");
        } else {
            return src.replace("@2x", "");
        }
    }
    window.hiResURL = hiResURL;

    var loadHiResImages = function() {
        $("img[data-hires=true]").each(function(){
            var el = $(this);
            var isImg = true;

            if (isImg) {
                var src = el.attr("src");

                if (src) {
                    el.attr("src", hiResURL(src, currentPixelRatio()));
                }
            }
        });
    }

    // Initial load
    loadHiResImages();

    // Make sure we update the images if the pixel ratio changes
    if (typeof(window["matchMedia"]) != "undefined") {
        window.matchMedia("(-webkit-device-pixel-ratio:1)").addListener(loadHiResImages);
    }

});