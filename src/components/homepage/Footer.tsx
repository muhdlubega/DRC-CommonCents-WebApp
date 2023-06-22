// import React from 'react';
// import '../../styles/CSS/footer.css';

// const Footer: React.FC = () => {
//     return (
//         <div className="footer">
//             <div className="footer-left">
                
//                 <div className="container">
//                  <button className="playstore-btn">
//                    Play Store For Download
//                  </button>
                    
//                  </div>
//             </div>
//             <ul className="footer-right">
//                 <li>
//                     <h4>Useful Links</h4>
//                     <li>
//                         <a>hfiuwefj</a>
//                     </li>
//                     <li>
//                         <a>nfrfir</a>
//                     </li>
//                     <li>
//                         <a>dnfoijrfi</a>
//                     </li>
//                 </li>
//                 <li>
//                     <h4>Contact Us</h4>
//                     <li>
//                         0112345678
//                     </li>
//                     <li>
//                         commoncents@gmail.com
//                     </li>
                    
//                 </li>
//                 <li>
//                     <h4>Social Media</h4>
//                     <div>
//                     <a href="/">
//                         <h3>Facebook</h3>
//                         <i className="fa-brands fa-facebook-square"></i>
//                     </a>
//                     <a href="/">
//                         <h3>Instagram</h3>
//                         <i className="fa-brands fa-instagram-square"></i>
//                     </a>
//                   <h3>Twitter</h3>
//                     <a href="/">
//                         <i className="fa-brands fa-twitter-square"></i>
//                     </a>
//                   </div>
//                 </li>
//             </ul>
//         </div>
//     );
// }

// export default Footer;

import React from 'react';
import '../../styles/CSS/footer.css';

const Footer: React.FC = () => {
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const playStoreBtn = ()=>{
      
    };
    return (
        <div className="footer">
            <div className="scroll-to-top" onClick={handleScrollToTop}>
                <i className="fas fa-arrow-up"></i> 
            </div>
            <div className="container">
                <div className="row">
                    <div className="footer-column">
                        <button className="playstore-btn" onClick={playStoreBtn }>
                            Play Store For Download
                        </button>
                    </div>
                    <div className="footer-column">
                          <h4>Useful Links</h4>
                          <ul>
                            <li className="nav-item">
                                <a className="">hfiuwefj</a>
                            </li>
                            <li className="nav-item">
                                <a className="">nfrfir</a>
                            </li>
                            <li className="nav-item">
                                <a className="">dnfoijrfi</a>
                            </li>
                          </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Contact Us</h4>
                        <p><i className="fa-solid fa-phone-volume"></i> 0112345678</p>
                        <p><i className="fa-solid fa-envelope"></i>commoncents@gmail.com</p>
                     </div>
                     <div className="col-md-6 col-lg-2 col-12 ft-4">
                       <div className="footer-icons">
                           <h4>Social Media</h4>
                            <i className="fa-brands fa-facebook-square">Facebook</i>
                            <i className="fa-brands fa-instagram-square">Instagram</i>
                            <i className="fa-brands fa-twitter-square">Twitter</i>
                        </div>
                     </div>
               </div>
            </div>
            <div className="footer-bottom">
             <p>Copyright&copy; 2023 CommonCents.All right reserved.</p> 
            </div>
        </div>
         
      
    );
}

export default Footer;
