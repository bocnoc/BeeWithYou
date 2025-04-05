// src/utils/animation.js
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

export const animateBee = (beeElement, index) => {
  if (beeElement && !beeElement.dataset.animated) {
    beeElement.dataset.animated = true;

    const generateRandomPath = () => [
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
    ];

    let currentPath = generateRandomPath();
    const tl = gsap.timeline({
      repeat: -1,
      delay: Math.random() * 5,
      onRepeat: () => {
        currentPath = generateRandomPath();
        tl.clear();
        let currentPos = gsap.getProperty(beeElement, 'x');
        let currentPosY = gsap.getProperty(beeElement, 'y');
        for (let i = 0; i < currentPath.length; i++) {
          const startPoint = i === 0 ? { x: currentPos, y: currentPosY } : currentPath[i - 1];
          const endPoint = currentPath[i];
          const direction = endPoint.x > startPoint.x ? 1 : -1;
          tl.to(beeElement, {
            rotationY: direction === 1 ? 180 : 0,
            duration: 0,
          }, i * segmentDuration);
          tl.to(beeElement, {
            x: endPoint.x,
            y: endPoint.y,
            duration: segmentDuration,
            ease: 'sine.inOut',
            motionPath: {
              path: [startPoint, endPoint],
              curviness: 2,
            },
          }, i * segmentDuration);
        }
      },
    });

    const totalDuration = Math.random() * 5 + 5;
    const segmentDuration = totalDuration / currentPath.length;

    for (let i = 0; i < currentPath.length; i++) {
      const startPoint = i === 0 ? { x: 0, y: 0 } : currentPath[i - 1];
      const endPoint = currentPath[i];
      const direction = endPoint.x > startPoint.x ? 1 : -1;
      tl.to(beeElement, {
        rotationY: direction === 1 ? 180 : 0,
        duration: 0,
      }, i * segmentDuration);
      tl.to(beeElement, {
        x: endPoint.x,
        y: endPoint.y,
        duration: segmentDuration,
        ease: 'sine.inOut',
        motionPath: {
          path: [startPoint, endPoint],
          curviness: 2,
        },
      }, i * segmentDuration);
    }

    gsap.set(beeElement, { rotation: 0 });
  }
};