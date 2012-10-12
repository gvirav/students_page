$(function() {

    // Figure out the offset of each bio popover,
    // since each one has different content length, they need to be different offsets.
    $("div#team span.bio").each(function(i){
        var el = $(this),
            arrow = $("span.arrow", el);

        var parentWidth = el.parent().outerWidth();

        // Top offset
        el.css("top", -el.outerHeight());

        // Left offset

        // See if we are on the left edge
        if (i % 7 == 0) {

            // Position arrow
            arrow.css({"left": (parentWidth / 2) - 11, "margin-left": 0});

        }

        // See if we are on the right edge
        else if (i % 7 == 6) {

            // Position arrow
            arrow.css({"left": (el.outerWidth() / 2) + (parentWidth / 2) - 22, "margin-left": 0});

            // Position popover
            el.css("left", -(el.outerWidth() - parentWidth))
        }

        // We are in the middle
        else {

            // Position popover
            el.css("left", -(el.outerWidth() - parentWidth) / 2)
        }

    });
    
    var names = [];
    
    $("div#team a")
        .each(function(index, element) {
            var el = $(element),
                name = $("em", el).text().toLowerCase().split(" ")[0];
                
            $(el).addClass(name);
            names.push(name);
        })
        .mouseover(function(element) {
            $("div#team a.force-hover").removeClass("force-hover");
            $("div#team a.faded").removeClass("faded");
        });
    
    var hash = window.location.hash;
    
    if (hash) {
        hash = hash.substring(1);
        $.each(names, function(index, value) {
            
            if (hash === names[index]) {
                var element = $("a." + names[index]);
                
                element.addClass("force-hover");
                
                // Fade all the other elements
                $("div#team a:not(." + names[index] + ")").addClass("faded");
                
                return false;
            }
        });
    }

    var pos = 0;
    var kcs = [68, 65, 82, 82, 65, 71, 72];
    $("body").keydown(function(event) {
      if (event.which == kcs[pos]) {
        pos++;
      } else {
        pos = 0;
      }

      if (pos == kcs.length) {
        pos = 0;
        $("#team a").each(function(index, element) {
          $(element).find("img").attr("src", "/img/about/team/d/" + index + ".jpeg");
          $(element).find(".inner").html($(".darragh .inner").html());
          var bio = $(element).find(".bio");
          bio.css("top", -bio.outerHeight());
        });
      }
    });

    /*shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    setTimeout(function(){
    var aboutContainer = $("div#about");
    if (aboutContainer.length) {
        $("a", aboutContainer).each(function(index, element){
            var el = $(element);

            // Prepare
            el.addClass("slide_prepare");


            //var delay = ($("a", aboutContainer).length * 100) - (index * 100);
            var delay = index * 30;

            // Add Animation
            setTimeout(function(){
                el.addClass("slide_in");
            }, delay);
        });
    }
    }, 300);/**/
});
