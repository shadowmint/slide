/**
 * HATCHD DIGITAL SLIDE jQUERY PLUGIN
 *
 * ATTRIBUTION-NONCOMMERCIAL-SHAREALIKE 3.0 UNPORTED
 *
 * THE WORK (AS DEFINED BELOW) IS PROVIDED UNDER THE TERMS OF THIS CREATIVE
 * COMMONS PUBLIC LICENSE ("CCPL" OR "LICENSE"). THE WORK IS PROTECTED BY
 * COPYRIGHT AND/OR OTHER APPLICABLE LAW. ANY USE OF THE WORK OTHER THAN AS
 * AUTHORIZED UNDER THIS LICENSE OR COPYRIGHT LAW IS PROHIBITED.
 *
 * BY EXERCISING ANY RIGHTS TO THE WORK PROVIDED HERE, YOU ACCEPT AND AGREE
 * TO BE BOUND BY THE TERMS OF THIS LICENSE. TO THE EXTENT THIS LICENSE MAY
 * BE CONSIDERED TO BE A CONTRACT, THE LICENSOR GRANTS YOU THE RIGHTS
 * CONTAINED HERE IN CONSIDERATION OF YOUR ACCEPTANCE OF SUCH TERMS AND
 * CONDITIONS.
 *
 * This code has been developed in house at HATCHD DIGITAL.
 * @see http://hatchd.com.au
 *
 * DEVELOPER USAGE:
 *
 * ALL external libraries and should be imported here, using a buildout
 * application e.g. CodeKit. This vesion of the file should be pretty,
 * well formatted, and only contain code that is unique to your OWN app.
 * Your site should always use /app-min.js when loading, which contains
 * a minified version of this script prepended with all external scripts.
 *
 * REQUIRED
 * @required jquery (v1.7.0+)
 *
 * IMPORTS
 * @import hatchdlings.module.js
 *
 * VALIDATION
 * All code must validate with JSHint (http://www.jshint.com/) to be launched
 * within a LIVE web application. NO debug code should remain in your final
 * versions e.g. remove EVERY reference to window.console.log().
 *
 * STYLE
 * All code should be within 79 characters WIDE to meet standard Hatchd
 * protocol. Reformat code cleanly to fit within this tool.
 *
 * jshint = { "laxcomma": true, "laxbreak": true, "browser": true }
 *
 * HATCHDLING SLIDE MODULE
 * FULL DOCUMENTATION: http://github.com/hatchddigital/jquery.slide
 *
 * This code builds a "sliding" bar for use on desktop and touch devices
 * when hiding content and sliding through it. See documentation
 *
 * @author Jimmy Hillis <jimmy@hatchd.com.au>
 * @see http://hatchd.com.au/
 *
 */

;(function() {

    var DATA_PROP = 'hl-slide'
      , ITEM = 'hls-item'
      , CURRENT = 'state-current'
      , HIDDEN = 'hide'
      , NEXT = 'hls-next'
      , PREV = 'hls-prev';

    /**
     * Base object for storing requried information about each Slide module
     * on any given page.
     */
    var Slide = function (element, visible, options)  {
        var slide = this;
        this.$element = $(element);
        this.visible = visible || false;
        this.items = this.$element.find('.'+ITEM);
        // Set and extend default options with user provided
        this.options = {
            'loop': false
        };
        this.options = $.extend(this.options, options);
        // Initialize default sizes and areas
        var gallery_width = this.items.length * this.locs().width
          , visible_width = this.visible * this.locs().width;
        // Current is manually provided else first
        if (!(this.current = this.items.find('.'+CURRENT)).length) {
            (this.current = this.items.first()).addClass(CURRENT);
        }
        // Hide all non-current elements
        this.items.slice(1).addClass(HIDDEN).hide();
        return this;
    };

    /**
     * Returns current positional information of the slider.
     */
    Slide.prototype.locs = function () {
        var slide = this;
        return {
            'before': (function () {
                return 0;
            }()),
            'after': (function () {
                return 0;
            }),
            'width': (function () {
                var width = slide.items.first().outerWidth();
                return width;
            }())
        };
    };

    /**
     * Moves the slider to reveal the previous n elements.
     */
    Slide.prototype.prev = function (n) {
        var item = this.locs()
          , prev = this.current.prev('.'+ITEM);
        if (!prev.length && this.options.loop) {
            prev = this.items.last();
        }
        if (!prev.length) {
            return false;
        }
        this.setCurrent(prev);
        return prev;
    };

    /**
     * Moves the slider to reveal the next n elements.
     */
    Slide.prototype.next = function (n) {
        var item = this.locs()
          , next = this.current.next('.'+ITEM);
        if (!next.length && this.options.loop) {
            next = this.items.first();
        }
        if (!next.length) {
            return false;
        }
        this.setCurrent(next);
        return next;
    };

    /**
     * Swaps the current showing slide with the element provided.
     * @param $HTMLElement new_slide: The new 'current' slide element which
     *                                should always be part of this.items
     *                                though isn't specifically required.
     */
    Slide.prototype.setCurrent = function (new_slide) {
        var current_slide = this.current;
        new_slide.removeClass(HIDDEN).addClass(CURRENT).show();
        this.current.removeClass(CURRENT).addClass(HIDDEN).hide();
        this.current = new_slide;
        // if provided, callback to user function
        if (typeof this.options.onchange === 'function') {
            this.options.onchange.call(this, new_slide, current_slide);
        }
    };

    /**
     * jQuery plugin attaches map to a specific DOM elements.
     */
    $.fn.slide = function (options) {

        options = options || {};

        this.each(function () {
            var $this = $(this)
              , slide = false;
            // If we can't find an existing modal, create a new one
            if (!slide) {
                slide = new Slide(this, (options.visible || 3), options);
                $this.data(DATA_PROP, slide);
            }
            // Events
            $this.find('.'+NEXT).on('click', function () {
                slide.next();
            });
            $this.find('.'+PREV).on('click', function () {
                slide.prev();
            });
        });

        if (this.length === 1) {
            return $(this).data(DATA_PROP);
        }

    };

}(window.jQuery));