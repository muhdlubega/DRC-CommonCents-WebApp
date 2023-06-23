

import React from 'react';
import '../../styles/main.scss';

// const Footer: React.FC = () => {
//     const handleScrollToTop = () => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };
//     const playStoreBtn = ()=>{
      
//     };
//     return (
//         <div className="footer">
//             <div className="scroll-to-top" onClick={handleScrollToTop}>
//                 <i className="fas fa-arrow-up"></i> 
//             </div>
//             <div className="container">
//                 <div className="row">
//                     <div className="footer-column">
//                         <button className="playstore-btn" onClick={playStoreBtn }>
//                             Play Store For Download
//                         </button>
//                     </div>
//                     <div className="footer-column">
//                           <h4>Useful Links</h4>
//                           <ul>
//                             <li className="nav-item">
//                                 <a className="">hfiuwefj</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="">nfrfir</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="">dnfoijrfi</a>
//                             </li>
//                           </ul>
//                     </div>
//                     <div className="footer-column">
//                         <h4>Contact Us</h4>
//                         <p><i className="fa-solid fa-phone-volume"></i> 0112345678</p>
//                         <p><i className="fa-solid fa-envelope"></i>commoncents@gmail.com</p>
//                      </div>
//                      <div className="col-md-6 col-lg-2 col-12 ft-4">
//                        <div className="footer-icons">
//                            <h4>Social Media</h4>
//                             <i className="fa-brands fa-facebook-square">Facebook</i>
//                             <i className="fa-brands fa-instagram-square">Instagram</i>
//                             <i className="fa-brands fa-twitter-square">Twitter</i>
//                         </div>
//                      </div>
//                </div>
//             </div>
//             <div className="footer-bottom">
//              <p>Copyright&copy; 2023 CommonCents.All right reserved.</p> 
//             </div>
//         </div>
         
      
//     );
// }

const Footer: React.FC = () => {
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="footer">
            <div className="scroll-to-top" onClick={handleScrollToTop}>
                <i className="fas fa-arrow-up"></i>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-4 ft-1">
                        <button className="btn btn-primary playstore-btn">GET IT ON GOOGLE PLAY</button>
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
                    <div className="col-md-6 col-lg-2  ft-4">
                        <h4>Socials</h4>
                        <div className="footer-icons">
                            <i className="fa-brands fa-square-facebook"></i>
                            <i className="fa-brands fa-square-instagram"></i>
                            <i className="fa-brands fa-square-twitter"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyrights&copy; 2023 CommonCents. All rights reserved.</p>
            </div>
        </div>
    );
};


export default Footer;
