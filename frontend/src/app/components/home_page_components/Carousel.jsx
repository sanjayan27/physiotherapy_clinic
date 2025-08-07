import React, { useState, useEffect } from "react";
import img1 from "../../assets/clinic-1.webp";
import img2 from "../../assets/clinic-2.jpg";
import img3 from "../../assets/clinic-3.webp";
import img4 from "../../assets/clinic-4.avif";
import img5 from "../../assets/clinic-5.jpg";
import Image from 'next/image'

const images = [img1, img2,img3, img4, img5];

export default function Carousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full z-0">
            {images.map((img, idx) => (
                <Image
                    key={idx}
                    src={img}
                    alt={`carousel-${idx + 1}`}
                    className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-700 ${
                        idx === current ? "opacity-100" : "opacity-0"
                    }`}
                    draggable={false}
                />
            ))}
        </div>
    );
}
