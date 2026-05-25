import React from "react";

const ProductVideoSection = () => {
  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 aspect-video">
        <video
          controls
          preload="metadata"
          className="w-full h-full object-cover"
          poster="https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779691423/AQNet4EhDuqqmmb3E2D27OlTKknQ8J3_KIfU8vVssbNn0MlCRxdxyvl00hZWBdhuP6DNFKUd5HEeSQ-acYLVxuUq_aoczgw.jpg" // Optional: Add an image to show before it plays
        >
          <source
            src="https://res.cloudinary.com/dwgro3zo7/video/upload/q_auto/f_auto/v1779690343/video-1066551389884546_tojxeo.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default ProductVideoSection;
