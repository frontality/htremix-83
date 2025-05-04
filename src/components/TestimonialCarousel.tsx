
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
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
  const [visibleItems, setVisibleItems] = useState<number[]>([0, 1, 2]);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    // Set up autoplay timer
    let timer: NodeJS.Timeout;
    
    if (autoplay) {
      timer = setInterval(() => {
        setVisibleItems(prev => {
          // Calculate the next set of visible items with wrap-around
          const nextItems = prev.map(index => (index + 1) % TESTIMONIALS.length);
          return nextItems;
        });
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

  const goToNext = () => {
    setVisibleItems(prev => prev.map(index => (index + 1) % TESTIMONIALS.length));
  };

  const goToPrev = () => {
    setVisibleItems(prev => prev.map(index => (index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length));
  };

  return (
    <div id="testimonial-carousel" className="relative overflow-hidden max-w-7xl mx-auto px-4">
      <Carousel 
        opts={{ 
          align: "start",
          loop: true,
        }}
        className="w-full"
        orientation="horizontal"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">What Our Customers Say</h2>
          <div className="flex gap-2">
            <CarouselPrevious onClick={goToPrev} className="relative static translate-y-0 left-0" />
            <CarouselNext onClick={goToNext} className="relative static translate-y-0 right-0" />
          </div>
        </div>
        
        <CarouselContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleItems.map((itemIndex) => (
            <CarouselItem 
              key={itemIndex}
              className="transition-opacity duration-1000 opacity-100 relative basis-full md:basis-1/3 pl-0 md:pl-4"
            >
              <TestimonialCard 
                name={TESTIMONIALS[itemIndex].name} 
                rating={TESTIMONIALS[itemIndex].rating}
                content={TESTIMONIALS[itemIndex].content}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Progress indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: Math.min(8, TESTIMONIALS.length) }).map((_, index) => (
          <button 
            key={index}
            className={`h-2 rounded-full transition-all ${
              visibleItems.includes(index) ? "w-6 bg-hottopic-red" : "w-2 bg-gray-600"
            }`}
            onClick={() => {
              // Calculate the set of testimonials to show starting from this index
              const newVisibleItems = [
                index,
                (index + 1) % TESTIMONIALS.length,
                (index + 2) % TESTIMONIALS.length
              ];
              setVisibleItems(newVisibleItems);
            }}
            aria-label={`Go to testimonial set ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, rating, content }: { name: string; rating: number; content: string }) => {
  return (
    <div className="bg-hottopic-dark p-6 rounded-lg border border-hottopic-gray/30 w-full transition-all duration-500 hover:border-hottopic-red/50 h-full">
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
