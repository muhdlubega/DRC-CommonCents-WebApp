import Navbar from "../components/navbar/Navbar"
import member1 from "../assets/images/bega.jpeg"
 import member2 from "../assets/images/cass.jpeg";
import member3 from "../assets/images/vino2.jpeg"
import member4 from "../assets/images/bentley.jpeg"
import Footer from "../components/homepage/Footer"

const AboutPage = () => {
  return (
    
   <div className="section-aboutus">
     <Navbar/>
     <div className="background-container">
  <div className="backgroundCircleTopLeft"></div>
  <div className="backgroundCircleBottomRight"></div>
  <div className="about-us">
  <div className="row">
     <h2>MEET OUR TEAM</h2>
     <div className="column">
          <div className="card">
            <img src={member1} alt="Bega"/>
               <div className="container">
                  <h2>Muhammad Lubega</h2>
                  <p className="title">Front-End Developer</p>
                  <p> "Quotes"</p>
               </div>
            </div>
         </div>
         <div className="column">
                  <div className="card">
                 <img src={member2} alt="CassJ"/>
                   <div className="container">
                      <h2>Cassandra Jacklya</h2>
                       <p className="title">Product Designer</p>
                       <p> "Quotes"</p>
                    </div>
                   </div>
                </div>
                <div className="column">
                  <div className="card">
                   <img src={member3} alt="Vino" style={{ width: '100%', height: '220px'}}/>
                   <div className="container">
                      <h2>Vinothinni Kannan</h2>
                       <p className="title">Quality Assurance</p>
                       <p> "Quotes"</p>
                    </div>
                   </div>
                </div>
                <div className="column">
                  <div className="card">
                 <img src={member4}  alt="Bentley"/>
                   <div className="container">
                      <h2>Bentley Teh</h2>
                       <p className="title">Mobile Developer</p>
                       <p> "Quotes"</p>
                    </div>
                   </div>
                </div>
   </div>
  </div>
 
</div>
<Footer/>
</div>
);
};

export default AboutPage;
