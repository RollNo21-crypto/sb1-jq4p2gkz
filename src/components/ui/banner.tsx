import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    title: 'Buy & Sell with Confidence',
    subtitle: 'Request quotes for your desired products',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6',
    title: 'Make a Difference',
    subtitle: 'Donate items to those in need',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
    title: 'Grow Your Business',
    subtitle: 'Register as a seller and reach more customers',
  },
]

export function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
            <p className="text-xl">{banner.subtitle}</p>
          </div>
        </div>
      ))}
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}