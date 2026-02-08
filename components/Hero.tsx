import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
    const desktopImages = [
        '/images/hero-slider-1.jpg',
        '/images/hero-slider-2.jpg'
    ];

    const mobileImages = [
        '/images/hero-mobile-1.jpg',
        '/images/hero-mobile-2.jpg'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // We assume both arrays have the same length for synchronized sliding
            setCurrentIndex((prevIndex) => (prevIndex + 1) % desktopImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full bg-black group">
            {/* Desktop Slider (7168x2368) */}
            <div className="hidden md:block relative w-full" style={{ aspectRatio: '7168/2368' }}>
                {desktopImages.map((img, index) => (
                    <div
                        key={`desktop-${img}`}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}

                <Link to="/smartphones" className="absolute inset-0 z-20 block cursor-pointer"></Link>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {desktopImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex ? 'bg-[#a5be31] w-6' : 'bg-gray-300/50 hover:bg-white'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile Slider (4544x3776) */}
            <div className="block md:hidden relative w-full" style={{ aspectRatio: '4544/3776' }}>
                {mobileImages.map((img, index) => (
                    <div
                        key={`mobile-${img}`}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}

                <Link to="/smartphones" className="absolute inset-0 z-20 block cursor-pointer"></Link>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {mobileImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-[#a5be31] w-5' : 'bg-gray-300/50 hover:bg-white'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
