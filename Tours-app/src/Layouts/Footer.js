


export default function Footer (){

    const topFunction = ()=>{
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
    

    return(
<>
 <div class="intro py-5">
        <div class="container py-5">
            <div class="intro-wrapper py-5 text-center">
                <div class="overlay-bl">
                </div>
                <div class="row">
                    <div class="col-md">
                        <h3>WE ARE PACIFIC A TRAVEL AGENCY</h3>
                        <p>We can manage your dream building A small river named Duden flows by their place</p>
                        <a href="/" class="btn btn-primary">Ask For A Quote</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <footer class="footer-tour bg-img py-5">
        <div class="container">
            <div class="row mb-5">
                <div class="col-md border-right">
                    <div class="footer-first">
                        <h5>About</h5>
                        <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                        <div class="list-icon">
                            <ul>
                                <li class="animated">
                                    <a href="/">
                                        <span class="fab fa-twitter"></span>
                                    </a>
                                </li>
                                <li class="animated">
                                    <a href="/">
                                        <span class="fab fa-facebook-f"></span>
                                    </a>
                                </li>
                                <li class="animated">
                                    <a href="/">
                                        <span class="fab fa-instagram"></span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md border-right">
                    <div class="footer-grids">
                        <h5>Infromation</h5>
                        <ul>
                            <li>
                                <a href="/" class="py-2 d-block">Online Enquiry</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">General Enquiries</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">Booking Conditions</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">Privacy and Policy</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">Refund Policy</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">Call Us</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md border-right">
                    <div class="footer-grids">
                        <h5>Experience</h5>
                        <ul>
                            <li>
                                <a href="/" class="py-2 d-block">Adventure</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">Hotel and Restaurant</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">Beach</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">Nature</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">Camping</a>
                            </li>
                            <li>
                                <a href="/" class="py-2 d-block">Party</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md">
                    <div class="footer-grids ends">
                        <h5>Have a question?</h5>
                        <ul>
                            <li>
                                <a href="https://www.google.com/maps/place/371+Nguy%E1%BB%85n+Ki%E1%BB%87m,+Ph%C6%B0%E1%BB%9Dng+3,+G%C3%B2+V%E1%BA%A5p,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam/@10.8162655,106.6756238,17z/data=!3m1!4b1!4m5!3m4!1s0x317528e195f816b7:0xfb5c0101490d8870!8m2!3d10.8162655!4d106.6778125?hl=vi-VN">
                                    <span class="icon-footer material-icons-outlined">place</span>
                                    <span class="text-footer">371 Nguyễn Kiệm, Ward 3, Go Vap District</span>
                                </a>
                            </li>
                            <li>
                                <a href="tel://0358833453" className="phone">
                                    <span class="icon-footer fa fa-phone"></span>
                                    <span class="text-footer">+8435 8833 453</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:1851050093Nghia@ou.edu.vn" className="mail">
                                    <span class="icon-footer fa fa-paper-plane"></span>
                                    <span class="text-footer">1851050093nghia@ou.edu.vn</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">
            Copyright ©2021 All rights reserved | This template is made with <i class="fa fa-heart"></i> by <a href="/home">Nghĩa Mặp</a>
        </div>
    </footer>
    <button onClick={topFunction} type="button" id="to-top" title="Go to top" style={{'display': 'none'}}>
      <span class="fas fa-level-up-alt"></span>
    </button>
</>
    )
}

