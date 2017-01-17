$(document).ready(function(){

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

        $('[data-id=menu]').on('click', function(event){
           $('[data-id=menu]').toggleClass('open');
        });
    }

    menu();

});