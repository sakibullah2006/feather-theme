/**
 * Alpine Slider Component
 * Reusable carousel/slider functionality with autoplay, navigation, and keyboard support
 *
 * Usage:
 * <div x-data="slider({ total: 3, autoplay: true, speed: 5000 })">
 *   <div x-show="current === 0" class="transition-opacity duration-500">Slide 1</div>
 *   <div x-show="current === 1" class="transition-opacity duration-500">Slide 2</div>
 *   <div x-show="current === 2" class="transition-opacity duration-500">Slide 3</div>
 *   <button @click="prev()">Previous</button>
 *   <button @click="next()">Next</button>
 * </div>
 */
export default function slider(config = {}) {
  return {
    current: 0,
    total: config.total || 0,
    autoplay: config.autoplay || false,
    speed: config.speed || 5000,
    interval: null,

    init() {
      if (this.autoplay && this.total > 1) {
        this.startAutoplay();
      }

      // Keyboard navigation
      this.$el.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") this.prev();
        if (e.key === "ArrowRight") this.next();
      });
    },

    next() {
      this.current = (this.current + 1) % this.total;
      this.resetAutoplay();
    },

    prev() {
      this.current = (this.current - 1 + this.total) % this.total;
      this.resetAutoplay();
    },

    goto(index) {
      if (index >= 0 && index < this.total) {
        this.current = index;
        this.resetAutoplay();
      }
    },

    startAutoplay() {
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => this.next(), this.speed);
    },

    stopAutoplay() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },

    resetAutoplay() {
      if (this.autoplay) {
        this.stopAutoplay();
        this.startAutoplay();
      }
    },

    destroy() {
      this.stopAutoplay();
    },
  };
}


