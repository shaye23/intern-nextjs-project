import React, { useState, useEffect } from 'react';

const Index = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    { src: '/celebrity_image.jpg', alt: 'Image 1', title: 'Celebrity Event', description: 'Entertainment Industry is growing significantly in recent times....' },
    { src: '/wedding.jpg', alt: 'Image 2', title: 'Wedding Event', description: 'For us, your wedding event is a blank canvas our team of emient designers..' },
    { src: '/relityshow.jpg', alt: 'Image 3', title: 'Reality Show', description: 'We have technical and infrastructural association & tie-ups with the true...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 2000); // Change the duration (in milliseconds) as per your requirement

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div className="text-container">
      <h2 className="animated-text text-xl font-bold">WELCOME TO EVENTLY - BEST WEDDING & EVENT MANAGEMENT COMPANY </h2>

      <div className="image-container">
        <div className="image-item image-centre">
          <h3 className="title-text font-bold">{images[currentImage].title}</h3>
          <img src={images[currentImage].src} alt={images[currentImage].alt} />
          <p>{images[currentImage].description}</p>
          <button className="bg-cyan-700 text-white duration-500 mt-4 rounded-md  px-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#E0AED0]">More Info</button>
        </div>
      </div>
    </div>
  );
};

export default Index;
