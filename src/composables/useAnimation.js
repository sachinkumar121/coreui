import confetti from 'canvas-confetti'

export default function useAnimation() {
    const starAnimation = function() {
        let defaults = {
            spread: 360,
            ticks: 80,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
            zIndex: 1050
        };
        confetti({
            ...defaults,
            particleCount: 80,
            scalar: 1.2,
            shapes: ['star']
        });
    
        confetti({
            ...defaults,
            particleCount: 30,
            scalar: 0.75,
            shapes: ['circle']
        });
    
    }
    const fireAnimation = function() {
        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }
    const fire = function(particleRatio, opts) {
        let count = 200;
        let initial = {
            origin: { y: 0.7 }
        };
        confetti({
            ...initial,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    return {
        starAnimation,
        fireAnimation
    }
}