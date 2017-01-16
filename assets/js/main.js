$(document).ready(function(){

    function fitVids(){
        //$('.section-container').fitVids();
    }

    function menu(){
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('[data-id=menu]').addClass('stacked');
            } else {
                $('[data-id=menu]').removeClass('stacked');
            }
        });

        if ($(window).scrollTop() > 100) {
            $('[data-id=menu]').addClass('stacked');
        } else {
            $('[data-id=menu]').removeClass('stacked');
        }
    }

    menu();
    fitVids();

});