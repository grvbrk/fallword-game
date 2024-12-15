import { useEffect, useRef } from 'react';

interface ParticleAttributes {
  x: number;
  y: number;
  radius: number;
  color: string;
  radians: number;
  velocity: number;
  shadowColor: string;
  shadowBlur: number;
  letter: string;
  update: () => void;
  draw: () => void;
}

export default function Snowfall() {
  // Initial Setup
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const c = canvas.getContext('2d');

      canvas.width = innerWidth;
      canvas.height = innerHeight;

      // Variables
      const attributes = {
        particleCount: 100, // Change amount of snowflakes
        particleSize: 3, // Max size of a snowflake
        fallingSpeed: 0.004, // Intensity of the snowfall horizontal
        colors: ['#ccc', '#eee', '#fff', '#ddd'], // Array of usable colors
        letters: [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
          's',
          't',
          'u',
          'v',
          'w',
          'x',
          'y',
          'z',
        ], // Array of uppercase and lowercase letters
      };

      const mouse = {
        x: innerWidth / 2,
        y: innerHeight / 2,
      };

      // Event Listeners
      addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
      });

      addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
      });

      // Utility Functions
      const randomIntFromRange = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };

      const randomColor = (colors: string[]) => {
        return colors[Math.floor(Math.random() * colors.length)];
      };

      const randomLetter = (letters: string[]) => {
        return letters[Math.floor(Math.random() * letters.length)];
      };

      const distance = (x1: number, y1: number, x2: number, y2: number) => {
        const xDist = x2 - x1;
        const yDist = y2 - y1;

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
      };

      // Objects
      // eslint-disable-next-line no-inner-declarations
      function Particle(
        this: ParticleAttributes,
        x: number,
        y: number,
        radius: number,
        color: string,
        radians: number,
        velocity: number,
        letter: string
      ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.radians = radians;
        this.velocity = velocity;
        this.letter = letter;
        this.shadowColor = 'transparent';
        this.shadowBlur = 0;

        this.update = () => {
          // Move these points over time
          this.radians += this.velocity;
          this.x = x + Math.cos(this.radians) * 400;
          this.y = y + Math.tan(this.radians) * 600;

          if (distance(mouse.x, mouse.y, this.x, this.y) < 200) {
            this.color = '#fc6';
            this.shadowColor = '#fc6';
            this.shadowBlur = 10;
            this.velocity = velocity - 0.002;
            // make it move away from the mouse
            // this.x += (this.x - mouse.x) * 0.06
            // this.y += (this.y - mouse.y) * 0.01
          } else {
            this.color = color;
            this.shadowColor = 'transparent';
            this.shadowBlur = 0;
            this.velocity = velocity - 0.001;
          }

          this.draw();
        };

        this.draw = () => {
          if (!c) return;

          c.font = `${this.radius * 10}px Arial`;
          c.fillStyle = this.color;
          c.shadowColor = this.shadowColor;
          c.shadowBlur = this.shadowBlur;
          c.fillText(this.letter, this.x, this.y);
        };
      }

      // Implementation
      let particles: ParticleAttributes[];
      const init = () => {
        particles = [];

        for (let i = 0; i < attributes.particleCount; i++) {
          particles.push(
            // @ts-ignore

            new Particle(
              Math.random() * canvas.width,
              Math.random() * canvas.height,
              randomIntFromRange(0.5, attributes.particleSize),
              // @ts-ignore
              randomColor(attributes.colors),
              Math.random() * 80,
              attributes.fallingSpeed,
              randomLetter(attributes.letters)
            )
          );
        }
      };

      // Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);
        if (!c) return;
        c.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle: { update: () => void }) => {
          particle.update();
        });
      };

      init();
      animate();
    }

    return () => {
      removeEventListener('mousemove', () => {});
      removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-0 h-full w-full motion-reduce:hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
