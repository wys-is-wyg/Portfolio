// semi-colon is a safety net against unclosed scripts 
;(function($, window, document, undefined){
    "use strict";
    if (!$.PDDM){ $.PDDM = {}; };

    /*
     * Adds blur event for chrome tabs that sleep
     */
    window.onblur = function(){ window.blurred = true; };
    window.onfocus = function(){ window.blurred = false; };

    /*
     * Define target slide element
     */
    $.PDDM.Slideshow = function(elem){
        this.elem       = elem;
    };

    
    /*
     * Instantiate slideshow with required settings
     *
     * @param {Int} currentSlide index of current slide, can offset
     * @param {Int} stayTime length that each slide appears
     * @param {Int} factor allows user to pass in seconds
     * @param {Boolean} looping whether to loop at end of cycle
     * @param {Boolean} auto whether to start animation on initiation
     * @return {Void}
     */
    $.PDDM.Slideshow.prototype = {
        currentSlide: 0,
        stayTime: 6,
        factor: 1000,
        looping: false,
        auto: true,
        timer: false,

        /*
         * Initiate slideshow
         */
        slideshow: function (){
            this.init();
            if (this.auto) {
                this.loop();
                this.listen();
            }
        },

        /*
         * Allows to pass in starting conditions
         */
        init: function (){},

        /*
         * Get the next slide
         */
        nextSlide: function (){
            clearTimeout(this.timer);
            this.looping = false;
            this.slideOut();
            this.currentSlide = ++this.currentSlide % this.elem.length;
            this.slideIn();
            if (this.auto) {
                this.loop();
            }
        },
        
        /*
         * Get the previous slide
         */
        previousSlide: function (){
            clearTimeout(this.timer);
            this.looping = false;
            this.slideOut();
            this.currentSlide == 0 ? this.currentSlide = this.elem.length-1 : this.currentSlide = this.currentSlide-1;
            this.slideIn();
            if (this.auto) {
                this.loop();
            }
        },
        
        /*
         * Go to slide at index
         */
        toSlide: function (index){
            if (index != this.currentSlide) {
                clearTimeout(this.timer);
                this.looping = false;
                this.slideOut();
                this.currentSlide = index;
                this.slideIn();
                if( this.auto ){
                    this.loop();
                }
            }
        },
        
        /*
         * Returns current slide
         */
        getSlide: function (){
            return this.elem.eq(this.currentSlide);
        },

        /*
         * Loop through slide
         */
        loop:  function (){
            if(this.auto){
                this.looping = true;
                this.timer = setTimeout(
                    $.proxy(function(){
                        if (window.blurred){
                            this.looping = false;
                            return;
                        }
                        this.nextSlide();
                    }, this),
                    this.stayTime*this.factor
                );
            }
        },
        
        /*
         * Animate out last slide
         */
        slideIn: function (){
            this.animateIn(this.getSlide());
        },
        
        /*
         * Animate in next slide
         */
        slideOut: function (){
            this.animateOut(this.getSlide());
        },
        
        /*
         * Resume looping on blurred tabs
         */
        listen: function(){
            window.addEventListener('focus', function (){
                if (!this.looping && this.auto) {
                    this.loop();
                }
            }.bind(this));
        },

        /*
         * Allow user to pass in animation function
         */
        animateIn: function(elem){},
        animateOut: function(elem){}
    };

    $(document).ready(function(){
        
        /********************     HERO SLIDES     *********************/
        var heroSlides                  = $('.pddm-slide');
        if (heroSlides.length > 1) {
            var heroNav                 = $('#pddm-slide-nav li a');
            var heroSlider              = new $.PDDM.Slideshow(heroSlides);
            heroSlider.looping          = true;
            heroSlider.init             = function(){
                $(heroSlides).eq(0).css({ 'opacity':1, 'z-index':1 });
                heroNav.eq(0).addClass('active');
            };
            heroSlider.animateIn        = function(elem){
                var index = $(elem).index();
                $(elem).css({ 'z-index':1 }).fadeTo(1000, 1);
                heroNav.removeClass('active');
                heroNav.eq(index).addClass('active');
            };
            heroSlider.animateOut       = function(elem){
                $(elem).delay(200).fadeTo(800, 0).css({ 'z-index':0 });
            };
            heroSlider.slideshow();
            $( '#pddm-slide-nav li a' ).click(function(e){
                e.preventDefault();
                var index = $(this).parent().index();
                heroSlider.toSlide(index);
                heroNav.eq(index).addClass('active');
            });
        }
        
    });
})(jQuery, window , document);