// Scroll function courtesy of Scott Dowding; http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling

$(document).ready(function() {
  // Check if element is scrolled into view
  function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

  /*
    * This creates a waypoint against each section
    * When the section reaches 50% up the page
    * an active class is added 
    */
  $('section').each( function() {
      var el      = $(this);
      var el_id   = el.attr("id");
      var anchor  = $('a[href="#'+el_id+'"]');

      el.waypoint({
          handler: function(direction) {
              $('.nav-link').removeClass('active');
              anchor.toggleClass('active');
              if ("technical_skills" === el_id) {
                  $('.chart').toggleClass('active');
              }
          },
          offset: '50%'
      });
  });

  /*
    * When a.nav-lionk is clicked, 
    * we add a graceful scroll effect 
    * and also toggle the nav active class
    */
  $('.nav-link, .navbar-brand').click(function() {
      var link = $(this);
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      $('html, body').animate(
          {
              scrollTop: target.offset().top-80
          },
          {
          duration: 1000,
          easing: 'swing',
          complete: function(){
              $('.nav-link').removeClass('active');
              $(link).addClass('active');
          }
      });
  });

  /*
    * Add scroll to top 
    * handling for footer
    */
  $("#back-to-top").click(function() {
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
  });

  /*
    * Add image pop-up 
    * for portfolio
    */
  $('#portfolio img').click(function(){
    var modal_image = $(this).attr('src');
    $('#modal-image-wrapper img').attr('src', '' );
    $('#modal-image-wrapper img').attr('src', modal_image);
    $('#modal-image').modal('show');
  }); 

  // If element is scrolled into view, fade it in
  $(window).scroll(function() {
    $('.animated').each(function() {
      if (isScrolledIntoView(this) === true) {
        var method = $(this).data('animation');
        $(this).addClass(method);
      }
    });
  });
});