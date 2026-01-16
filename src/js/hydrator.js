/**
 * Centralized Hydrator Store for Alpine.js
 *
 * Handles AJAX section updates using Shopify's Section Rendering API.
 * Any component can trigger a section refresh by calling:
 * $store.hydrator.fetch(url, sectionId, slots)
 *
 * @example
 * // Update product grid on pagination
 * $store.hydrator.fetch('/collections/all?page=2', 'main-collection', ['ProductGridContainer'])
 *
 * @example
 * // Update multiple slots simultaneously
 * $store.hydrator.fetch('/search?q=shoes', 'main-search', ['SearchResultsContainer', 'SearchCount'])
 */

export function initHydrator() {
  document.addEventListener("alpine:init", () => {
    Alpine.store("hydrator", {
      isHydrating: false,

      /**
       * Fetch and hydrate section content
       *
       * @param {string} url - Target URL to fetch
       * @param {string} sectionId - Shopify section ID
       * @param {string[]} slots - Array of DOM element IDs to update
       * @returns {Promise<void>}
       */
      async fetch(url, sectionId, slots = []) {
        this.isHydrating = true;

        // Notify other components (like global loaders)
        window.dispatchEvent(
          new CustomEvent("section:loading-start", {
            detail: { url, sectionId, slots },
          }),
        );

        // Ensure we target the Shopify Section Rendering API
        const fetchUrl = new URL(url, window.location.origin);
        fetchUrl.searchParams.set("section_id", sectionId);

        try {
          const response = await fetch(fetchUrl.toString());

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, "text/html");

          // Loop through the requested IDs and swap them
          slots.forEach((slotId) => {
            const newEl = doc.getElementById(slotId);
            const currentEl = document.getElementById(slotId);

            if (newEl && currentEl) {
              currentEl.innerHTML = newEl.innerHTML;

              // Crucial: Re-initialize Alpine in the new HTML
              if (window.Alpine) {
                window.Alpine.initTree(currentEl);
              }
            } else {
              console.warn(
                `Hydrator: Could not find slot "${slotId}" in DOM or response`,
              );
            }
          });

          // Update URL bar without reload
          const historyUrl = new URL(url, window.location.origin);
          historyUrl.searchParams.delete("section_id"); // Keep URL clean
          window.history.pushState(
            { path: historyUrl.toString() },
            "",
            historyUrl.toString(),
          );

          // Notify success
          window.dispatchEvent(
            new CustomEvent("section:loading-success", {
              detail: { url, sectionId, slots },
            }),
          );
        } catch (error) {
          console.error("Hydration failed:", error);

          // Notify error
          window.dispatchEvent(
            new CustomEvent("section:loading-error", {
              detail: { url, sectionId, slots, error },
            }),
          );
        } finally {
          this.isHydrating = false;
          window.dispatchEvent(
            new CustomEvent("section:loading-end", {
              detail: { url, sectionId, slots },
            }),
          );
        }
      },

      /**
       * Fetch with form data
       * Useful for filter forms, search forms, etc.
       *
       * @param {HTMLFormElement} form - Form element
       * @param {string} sectionId - Shopify section ID
       * @param {string[]} slots - Array of DOM element IDs to update
       * @returns {Promise<void>}
       */
      async fetchForm(form, sectionId, slots = []) {
        const formData = new FormData(form);
        const params = new URLSearchParams(formData);
        const url = `${form.action}?${params.toString()}`;

        return this.fetch(url, sectionId, slots);
      },

      /**
       * Check if currently hydrating
       * @returns {boolean}
       */
      isLoading() {
        return this.isHydrating;
      },
    });
  });
}
