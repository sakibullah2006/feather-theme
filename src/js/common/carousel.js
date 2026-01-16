/**
 * Alpine Carousel Component
 * Uses native CSS scroll-snap for a performant, snappy slider.
 *
 * @param {number} step - Number of items to skip per scroll (defaults to visible items)
 */
export default function Carousel(step = null) {
  return {
    step: step,
    atStart: true,
    atEnd: false,
    init() {
      // Initialize scroll position check
      this.update();

      // Update on scroll
      if (this.$refs.container) {
        this.$refs.container.addEventListener(
          "scroll",
          () => {
            this.update();
          },
          { passive: true },
        );

        // Update on resize
        window.addEventListener(
          "resize",
          () => {
            this.update();
          },
          { passive: true },
        );
      }
    },
    next() {
      this.scroll("next");
    },
    prev() {
      this.scroll("prev");
    },
    scroll(direction) {
      const container = this.$refs.container;
      if (!container) return;

      // Calculate how many items are visible
      const containerWidth = container.clientWidth;
      const firstChild = container.firstElementChild;
      if (!firstChild) return;

      const cardWidth = firstChild.clientWidth;
      const gap = 16; // 1rem gap

      // Use custom step if provided, otherwise calculate items per view
      let itemsToScroll;
      if (this.step !== null) {
        itemsToScroll = this.step;
      } else {
        // Calculate items per view (how many cards fit in the visible area)
        itemsToScroll = Math.floor(containerWidth / (cardWidth + gap));
      }

      // Scroll by the specified number of items
      const scrollAmount = (cardWidth + gap) * itemsToScroll;

      const currentScroll = container.scrollLeft;
      const targetScroll =
        direction === "next"
          ? currentScroll + scrollAmount
          : currentScroll - scrollAmount;

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    },
    update() {
      const container = this.$refs.container;
      if (!container) return;

      // Check if at start (with small threshold for rounding errors)
      this.atStart = container.scrollLeft <= 1;

      // Check if at end (with small threshold for rounding errors)
      const maxScroll = container.scrollWidth - container.clientWidth;
      this.atEnd = container.scrollLeft >= maxScroll - 1;
    },
  };
}

if (window.Alpine) {
  window.Alpine.data("Carousel", Carousel);
}
