// A small damped spring, stepped with requestAnimationFrame. Used by the desk objects
// (lanyard swing, lamp chain, sticky-note peel) so they all move with the same physics.

export interface SpringOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
  /** Called every frame with the current value. */
  onUpdate: (value: number, velocity: number) => void;
  /** Called when the spring comes to rest. */
  onRest?: () => void;
}

export class Spring {
  value = 0;
  velocity = 0;
  target = 0;
  private raf = 0;
  private last = 0;
  constructor(private o: SpringOptions) {}

  /** Jump straight to a value (no animation). */
  set(value: number) {
    this.value = this.target = value;
    this.velocity = 0;
    this.o.onUpdate(value, 0);
  }

  /** Animate towards a target. */
  to(target: number) {
    this.target = target;
    this.start();
  }

  /** Add velocity, as from a flick or a nudge. */
  kick(velocity: number) {
    this.velocity += velocity;
    this.start();
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private start() {
    if (this.raf) return;
    this.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - this.last) / 1000);
      this.last = now;
      const { stiffness = 170, damping = 16, mass = 1 } = this.o;
      const force = -stiffness * (this.value - this.target) - damping * this.velocity;
      this.velocity += (force / mass) * dt;
      this.value += this.velocity * dt;
      this.o.onUpdate(this.value, this.velocity);
      if (Math.abs(this.velocity) < 0.01 && Math.abs(this.value - this.target) < 0.01) {
        this.set(this.target);
        this.raf = 0;
        this.o.onRest?.();
        return;
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }
}

/** True when motion should be kept to a minimum: the system setting, or Calm motion in Control Center. */
export const calm = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.calm === '1';
