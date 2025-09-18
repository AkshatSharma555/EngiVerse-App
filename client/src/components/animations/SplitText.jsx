// Filename: client/src/components/animations/SplitText.jsx
// (Updated by your AI assistant with ScrollTrigger for performance)

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the plugin once
gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  text,
  tag = 'p',
  className = '',
  splitType = 'chars',
  from = { opacity: 0, y: 20 },
  stagger = 0.03,
  delay = 0,
  duration = 0.6,
  ease = 'power3.out',
  ...props
}) => {
  const compRef = useRef(null);

  useGSAP(() => {
    if (!compRef.current) return;
    
    // Split the text manually
    const elements = String(text).split('').map(char => {
        const el = document.createElement('span');
        el.textContent = char === ' ' ? '\u00A0' : char;
        el.style.display = 'inline-block';
        return el;
    });

    compRef.current.innerHTML = '';
    elements.forEach(el => compRef.current.appendChild(el));
    
    // Animate with ScrollTrigger
    gsap.from(elements, {
      ...from,
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger: {
        trigger: compRef.current,
        start: 'top 90%', // Animate when the top of the text is 90% from the top of the viewport
        end: 'bottom 10%',
        toggleActions: 'play none none none',
        once: true, // Animate only once
      }
    });

  }, { dependencies: [text], scope: compRef });

  const Tag = tag;
  return <Tag ref={compRef} className={className} {...props}/>;
};

export default SplitText;