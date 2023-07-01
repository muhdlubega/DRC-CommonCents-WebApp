import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import '../../styles/main.scss'
import trading from '../../assets/images/guytablet.png'
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const animationControls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    animationControls.start({ y: 0, opacity: 1, transition: { duration: 2 } });
  }, [animationControls]);

  return (
    <div className="banner-main">
      <motion.div
        className="banner-text"
        initial={{ y: -50, opacity: 0 }}
        animate={animationControls}
      >
        <div className="banner-container">
          <motion.h2 className="banner-title">Trading,</motion.h2>
          <motion.h2 className="banner-title">all in one place</motion.h2>
          <motion.p className="banner-tagline">
            Join us and learn more about trading! It's CommonCents!
          </motion.p>
          <motion.button
        className="banner-btn"
        onClick={() => navigate("/trade/1HZ10V")}
      >
        Create an Account
      </motion.button>
        </div>
      </motion.div>
      <motion.div
        className="banner-img-container"
        initial={{ y: -50, opacity: 0 }}
        animate={animationControls}
      >
        <div className="banner-image-box"></div>
        <motion.img className="banner-image" src={trading} alt="trading-image" />
      </motion.div>
    </div>
  );
};

export default Banner;
