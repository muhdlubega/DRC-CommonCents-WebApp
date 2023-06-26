import React from 'react';
import '../../styles/main.scss';
import Image1 from '../../assets/images/google-ps.png'
import SocialMedia1 from '../../assets/images/facebook.png'
import SocialMedia2 from '../../assets/images/ig.png'
import SocialMedia3 from '../../assets/images/twitter.png'

const Footer: React.FC = () => {
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="footer">
            {/* <div className="scroll-to-top" onClick={handleScrollToTop}>
               <i className="fas fa-chevron-up"></i>
            </div>  */}
            <div className="footer-container">
                <div className="row">
                    <div className="col-md-6 col-lg-3 ft-1">
                    <a href="/">
                        <img src={Image1} alt="Image Button"></img>
                    </a>
                    </div>
                    
                    <div className="col-md-6 col-lg-3 ft-2">
                        <h4>Useful Links</h4>
                        <ul>
                            <li className="nav-item">
                               <a className="nav-link" href="#">Help and Support</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Team</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-6 col-lg-3 ft-3">
                        <h4>Contact Us</h4>
                        <p><i className="fas fa-phone-volume"></i> &nbsp; 0112345678</p>
                        <p><i className="fas fa-envelope"></i> &nbsp; commoncents@gmail.com</p>
                    </div>
                    <div className="col-md-6 col-lg-3 ft-4">
                        <h4>Socials</h4>
                        <div>
                         <a href="/"><img src={SocialMedia1} alt="Image Button" style={{ width: '70px',marginLeft:-5,marginRight:3,height:'72px',marginTop:'11px'}}></img></a>
                         <a href="/"><img src={SocialMedia2} alt="Image Button"></img></a>
                         <a href="/"><img src={SocialMedia3} alt="Image Button"></img></a>
                         
                        </div>
                    </div>
                    <button style={{padding:10, borderRadius: 100, backgroundColor: 'blue', color: 'white', fontWeight: 'bold'}} onClick={handleScrollToTop}>Back to Top</button>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyrights&copy; 2023 CommonCents. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;



