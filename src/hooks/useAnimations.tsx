
import { useState, useEffect, useRef } from 'react';

export const useAnimations = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '10px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  // Auto-show animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Counter animation utility
  const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let startTime: number;
      let animationFrame: number;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, [end, duration]);
    
    return count;
  };

  // Stagger animation delays
  const getStaggerDelay = (index: number, baseDelay: number = 100) => {
    return `${index * baseDelay}ms`;
  };

  // Enhanced hover animation classes
  const hoverClasses = {
    scale: 'hover:scale-105 transition-transform duration-300',
    lift: 'hover:-translate-y-2 transition-transform duration-300',
    glow: 'hover:shadow-lg hover:shadow-current/20 transition-all duration-300',
    rotate: 'hover:rotate-1 transition-transform duration-300',
    tilt: 'hover:rotate-3 hover:scale-105 transition-transform duration-300',
  };

  // Animation classes with new additions
  const animationClasses = {
    fadeIn: 'animate-fade-in',
    scaleIn: 'animate-scale-in',
    float: 'animate-float',
    pulseGlow: 'animate-pulse-glow',
    bounceSubtle: 'animate-bounce-subtle',
  };

  return {
    isVisible,
    isInView,
    elementRef,
    useCountUp,
    getStaggerDelay,
    hoverClasses,
    animationClasses,
  };
};

// Utility function for combining animation classes
export const combineAnimations = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

// Enhanced animation presets
export const animationPresets = {
  cardHover: 'hover:scale-105 hover:-translate-y-1 transition-all duration-300',
  buttonHover: 'hover:scale-105 hover:shadow-lg transition-all duration-200',
  iconPulse: 'animate-pulse-glow',
  floatingElement: 'animate-float',
  staggerFade: (index: number) => `animate-fade-in` + (index > 0 ? ` [animation-delay:${index * 150}ms]` : ''),
};
