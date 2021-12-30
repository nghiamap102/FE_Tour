/* eslint-disable no-undef */
$(window).on('scroll', function() {
    var scroll = $(window).scrollTop();
    if (scroll > 200) {
        $('#header-top').addClass('scrolling');
    } else {
        $('#header-top').removeClass('scrolling');
    }
    if (scroll > 300) {
        $('#header-top').addClass('show');
    } else {
        $('#header-top').removeClass('show');
        if (scroll > 200 && scroll < 300) {
            $('#header-top').addClass('sleep');
        }
    }
    if (scroll === 0) {
        $('#header-top').removeClass('sleep')
    }

});



// function eyepassword() {
//     var x = document.getElementById("input_password");
//     var y = document.getElementById("eye-open");
//     var z = document.getElementById("eye-close");
//     if (x.type === 'password') {
//         x.type = "text";
//         y.style.display = "block";
//         z.style.display = "none";
//     } else {
//         x.type = 'password';
//         y.style.display = "none";
//         z.style.display = "block";
//     }
// };

window.onscroll = function() {
    scrollTopFunction();

}



function scrollTopFunction() {
    if (document.documentElement.scrollTop > 200 || document.body.scrollTop > 200) {
        document.getElementById('to-top').style.display = "block";
    } else {
        document.getElementById('to-top').style.display = "none";
    }
}


function getEle(id) {
    return document.getElementById(id);
}



window.onload = function() {
    // eyepassword();

}
$(window).on('load', function() {
    $('.owl-carousel').owlCarousel({
        loop: true,
        nav: false,
        margin: 30,
        responsiveClass: true,
        autoplay: true,
        autoplayTimeout: 4000,
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            600: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    })
    var a = document.querySelectorAll('.packed-wrapper')
    function show(adevent, show, name) {
        $(adevent).mouseover(function() {
            $(show).show();
            $(name).show();
        })
    }
   
    function hide(adevent, show, name) {
        $(adevent).mouseout(function() {
            $(show).hide(); 
            $(name).hide();
            
        })
    }

    for (let i = 1; i <= a.length; i++) {
        show('.i' + i, '.a' + i, '.c' + i)
        hide('.i' + i, '.a' + i, '.c' + i)
    }
})
