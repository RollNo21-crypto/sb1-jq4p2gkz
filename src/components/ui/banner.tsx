// import React, { useState, useEffect } from 'react'
// import { ChevronLeft, ChevronRight } from 'lucide-react'

// const banners = [
//   {
//     id: 1,
//     image: '/assets/buybanner.jpg',
//     // title: 'Buy & Sell with Confidence',
//     // subtitle: 'Request quotes for your desired products',
//   },
//   {
//     id: 2,
//     image: '/assets/donatebanner.jpg',
//     // title: 'Make a Difference',
//     // subtitle: 'Donate items to those in need',
//   },
//   {
//     id: 3,
//     image: '/assets/sellbanner.jpg',
//     // title: 'Grow Your Business',
//     // subtitle: 'Register as a seller and reach more customers',
//   },
// ]

// export function Banner() {
//   const [currentSlide, setCurrentSlide] = useState(0)

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % banners.length)
//     }, 4000)
//     return () => clearInterval(timer)
//   }, [])

//   const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length)
//   const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)

//   return (
//     <div className="relative h-[500px] w-full overflow-hidden">
//       {banners.map((banner, index) => (
//         <div
//           key={banner.id}
//           className={`absolute inset-0 transition-opacity duration-1000 ${
//             index === currentSlide ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{ backgroundImage: `url(${banner.image})` }}
//           >
//             {/* <div className="absolute inset-0 bg-black/50" /> */}
//           </div>
//           <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
//             {/* <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
//             <p className="text-xl">{banner.subtitle}</p> */}
//           </div>
//         </div>
//       ))}
      
//       <button
//         onClick={prevSlide}
//         className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
//       >
//         <ChevronLeft className="h-6 w-6 text-white" />
//       </button>
      
//       <button
//         onClick={nextSlide}
//         className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
//       >
//         <ChevronRight className="h-6 w-6 text-white" />
//       </button>
      
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//         {banners.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`h-2 w-2 rounded-full transition-colors ${
//               index === currentSlide ? 'bg-white' : 'bg-white/50'
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    desktopImage: "/assets/buybanner.jpg",
    mobileImage: "/assets/mobilebuy.jpg",
    alt: "Buy & Sell",
  },
  {
    id: 2,
    desktopImage: "/assets/donatebanner.jpg",
    mobileImage: "/assets/mobiledonate.jpg",
    alt: "Donate Items",
  },
  {
    id: 3,
    desktopImage: "/assets/sellbanner.jpg",
    mobileImage: "/assets/mobilesell.jpg",
    alt: "Sell Products",
  },
];

export function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-[90vh] max-h-screen overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <picture>
            {/* Optimized Mobile Image */}
            <source
              media="(max-width: 768px)"
              srcSet={`${banner.mobileImage}?w=500&h=800&fit=crop&auto=format`}
            />
            {/* Optimized Desktop Image */}
            <img
              src={`${banner.desktopImage}?w=1200&h=800&fit=crop&auto=format`}
              alt={banner.alt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}


