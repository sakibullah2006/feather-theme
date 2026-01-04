/**
 * Desktop Dropdown Menu Component
 * Handles both simple dropdowns (one level) and mega menus (two levels)
 */
export default function dropdownMenu() {
  return {
    openDropdown: null,
    hoverTimeout: null,

    init() {
      // Initialize component
      console.log("Dropdown menu initialized");
    },

    /**
     * Check if dropdown has grandchildren (mega menu)
     */
    hasMegaMenu(linkId) {
      const dropdown = document.querySelector(`[data-dropdown="${linkId}"]`);
      if (!dropdown) return false;
      return dropdown.querySelector('[data-has-grandchildren="true"]') !== null;
    },

    /**
     * Open dropdown on hover
     */
    openMenu(linkId) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        this.openDropdown = linkId;
      }, 100);
    },

    /**
     * Close dropdown with delay
     */
    closeMenu() {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        this.openDropdown = null;
      }, 200);
    },

    /**
     * Cancel close when hovering dropdown
     */
    keepOpen() {
      clearTimeout(this.hoverTimeout);
    },

    /**
     * Check if dropdown is open
     */
    isOpen(linkId) {
      return this.openDropdown === linkId;
    },

    /**
     * Close on escape key
     */
    handleEscape() {
      this.openDropdown = null;
      clearTimeout(this.hoverTimeout);
    },
  };
}
