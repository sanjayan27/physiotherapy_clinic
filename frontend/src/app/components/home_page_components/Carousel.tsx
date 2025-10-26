import React, { useEffect, useState } from "react";
import img1 from "../../assets/clinic-1.webp";
import img2 from "../../assets/clinic-2.jpg";
import img3 from "../../assets/clinic-3.jpeg";
import img5 from "../../assets/clinic-5.jpg";
import Image from "next/image";
import { Box } from "@mui/material";

const images = [img1, img2, img3, img5];

const Carousel: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}>
      {images.map((img, idx) => (
        <Image
          key={idx}
          src={img}
          alt={`carousel-${idx + 1}`}
          style={{ objectFit: "cover", position: "absolute", inset: 0, width: "100%", height: "100%", opacity: idx === current ? 1 : 0, transition: "opacity 700ms" }}
          draggable={false}
          priority
        />
      ))}
    </Box>
  );
};

export default Carousel;
