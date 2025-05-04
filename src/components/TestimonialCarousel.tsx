
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Star } from "lucide-react";

// Testimonial data with compelling 5-star reviews
const TESTIMONIALS = [
  {
    name: "Jessica M.",
    rating: 5,
    content: "I got a Hot Topic gift card for my daughter at 50% off and she absolutely loved it! Fast delivery and no issues with redemption. Best deal I've found online!"
  },
  {
    name: "Mike T.",
    rating: 5,
    content: "Perfect gift for my niece who loves Hot Topic. The process was simple and the discount was amazing. Will definitely purchase again for future gifts!"
  },
  {
    name: "Sarah K.",
    rating: 5,
    content: "I was skeptical at first, but the gift card worked perfectly at my local Hot Topic store. Saved me $250 on a $500 card! Incredible value."
  },
  {
    name: "David R.",
    rating: 5,
    content: "My teenager was thrilled with their Hot Topic gift card. The 50% discount made it possible to get a larger denomination than I could normally afford. Win-win!"
  },
  {
    name: "Emma L.",
    rating: 5,
    content: "The gift card arrived instantly in my email. Used it the same day at Hot Topic with zero problems. Half price for full value is an absolute steal!"
  },
  {
    name: "Alex W.",
    rating: 5,
    content: "Been buying these discounted gift cards for months now. Always authentic, always work perfectly. It's like getting all my Hot Topic purchases at half price!"
  },
  {
    name: "Olivia P.",
    rating: 5,
    content: "My son is obsessed with Hot Topic and these gift cards let me stretch my budget twice as far. Customer service was excellent when I had questions."
  },
  {
    name: "Ryan J.",
    rating: 5,
    content: "As a college student on a budget, these discounted gift cards are a lifesaver. I can get all my favorite Hot Topic merch without breaking the bank!"
  }
];

const TestimonialCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    // Set up autoplay timer
    let timer: NodeJS.Timeout;
    
    if (autoplay) {
      timer = setInterval(() => {
        setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
      }, 10000); // Change every 10 seconds
    }
    
    // Pause autoplay when user hovers over carousel
    const handleMouseEnter = () => setAutoplay(false);
    const handleMouseLeave = () => setAutoplay(true);
    
    const carouselEl = document.getElementById('testimonial-carousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', handleMouseEnter);
      carouselEl.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      clearInterval(timer);
      if (carouselEl) {
        carouselEl.removeEventListener('mouseenter', handleMouseEnter);
        carouselEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [autoplay]);

  return (
    <div id="testimonial-carousel" className="relative overflow-hidden max-w-5xl mx-auto">
      <Carousel 
        opts={{ 
          align: "start",
          loop: true,
        }}
        className="w-full"
        orientation="horizontal"
      >
        <CarouselContent>
          {TESTIMONIALS.map((testimonial, index) => (
            <CarouselItem 
              key={index}
              className={`transition-opacity duration-1000 ${
                index === activeIndex ? "opacity-100" : "opacity-0 absolute"
              }`}
            >
              <TestimonialCard 
                name={testimonial.name} 
                rating={testimonial.rating}
                content={testimonial.content}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Progress indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {TESTIMONIALS.map((_, index) => (
          <button 
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-hottopic-red" : "w-2 bg-gray-600"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, rating, content }: { name: string; rating: number; content: string }) => {
  return (
    <div className="bg-hottopic-dark p-6 rounded-lg border border-hottopic-gray/30 w-full md:max-w-2xl mx-auto transition-all duration-500 hover:border-hottopic-red/50 h-full">
      <div className="flex items-center mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i}
            className={`w-4 h-4 fill-current ${i < rating ? 'text-yellow-500' : 'text-gray-400'}`}
          />
        ))}
      </div>
      <p className="text-gray-300 mb-4 text-sm md:text-base italic">"{content}"</p>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-hottopic-gray/50 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {name.charAt(0)}
        </div>
        <p className="text-white font-semibold ml-2">{name}</p>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
