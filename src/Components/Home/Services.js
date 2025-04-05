import React from "react";
import { Link } from "react-router-dom";
import imgConvert from "../../Assets/convert.png";
import imgLearnSign from "../../Assets/learn-sign.jpg";
import imgVideos from "../../Assets/videos.png";
import imgAiAnimation from "../../Assets/ai-animation.png"; // Add a relevant image for AI Animation

function Services() {
  return (
    <section id="services">
      <div className="container">
        <div className="row mt-5">
          <div
            className="col-md-12 d-flex justify-content-center align-items-center"
            style={{ flexDirection: "column" }}
          >
            <div className="h2 section-heading">Our Services</div>
            <div className="col-lg-4 divider my-2" />
            <div className="text-center normal-text">
              A comprehensive and aesthetic Indian Sign Language toolkit. A
              minimalist yet informative interface. Wide range of features
              containing different functionalities that are necessary to work
              with ISL. What else do you need anyway! We have everything wrapped
              up here! <br /> Dive into our diverse services and let us know
              about your experience!
            </div>
          </div>
        </div>
        <div className="card-deck">
          <div className="row">
            {/* Existing Services */}
            {[
              {
                img: imgConvert,
                title: "Convert",
                text: "Want to convert audio or text into Indian Sign Language? Then, you are in the right place! Provide your audio by speaking into your mic or type the text that you want to convert into ISL and within a few clicks watch the magic happen!",
                link: "/sign-kit/convert",
              },
              {
                img: imgLearnSign,
                title: "Learn Sign",
                text: "Curious about Indian Sign Language? Then, learn ISL from us! Select a sign from the list, watch it as many times as you want and learn ISL. Learning something is always a good thing, you know!",
                link: "/sign-kit/learn-sign",
              },
              {
                img: imgVideos,
                title: "Videos",
                text: "Interested in creating wonderful videos using Indian Sign Language? Upload your transcript as a text file, type your text in the provided area or speak through your mic and the system will automatically create a video using ISL for your content! Share your videos with the entire community!",
                link: "/sign-kit/all-videos",
              },
              {
                img: imgAiAnimation,
                title: "AI Conversation",
                text: "Want to bring your sign language gestures to life? With our AI Animation tool, you can create dynamic, lifelike animations of ISL gestures to enhance learning and communication. Experience the next level of ISL visualization!",
                link: "/sign-kit/ai-animation",
              },
            ].map((service, index) => (
              <div className="col-lg-4 mt-5" key={index}>
                <div className="card col-lg-12 h-100 d-flex flex-column justify-content-between card-background">
                  <img className="card-img-top" src={service.img} alt={`${service.title} Clipart`} />
                  <div className="card-body">
                    <h5 className="card-title">{service.title}</h5>
                    <p className="card-text">{service.text}</p>
                  </div>
                  <div className="card-footer p-0 m-0" style={{ border: "none" }}>
                    <Link to={service.link} className="btn btn-info w-100 p-3" style={{ fontSize: "large" }}>
                      EXPLORE NOW!
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
