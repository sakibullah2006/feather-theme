# Hydrator Store - Usage Examples

The Hydrator store provides a centralized way to handle AJAX updates using Shopify's Section Rendering API with Alpine.js.

## Basic Usage

### Pagination

```liquid
{% paginate collection.products by 12 %}
  <div id="ProductGridContainer">
    <!-- Product grid content -->
  </div>

  {% render 'pagination',
    paginate: paginate,
    section_id: section.id,
    slots: 'ProductGridContainer,CollectionProductCount'
  %}
{% endpaginate %}
```

### Search Input with Debounce

```liquid
<input
  type="text"
  name="q"
  placeholder="{{ 'general.search.placeholder' | t }}"
  @input.debounce.500ms="$store.hydrator.fetch(
    '/search?q=' + $el.value,
    'main-search',
    ['SearchResultsContainer', 'SearchCount']
  )"
>

<div id="SearchResultsContainer">
  <!-- Search results -->
</div>

<div id="SearchCount">
  {{ search.results_count }} {{ 'general.search.results' | t }}
</div>
```

### Collection Filters (Checkbox)

```liquid
<form action="{{ collection.url }}" method="get">
  <input
    type="checkbox"
    name="filter.v.availability"
    value="1"
    @change="$store.hydrator.fetchForm(
      $event.target.form,
      '{{ section.id }}',
      ['ProductGridContainer', 'ProductCount', 'ActiveFilters']
    )"
  >
  <label>{{ 'products.facets.availability' | t }}</label>
</form>

<div id="ProductGridContainer">
  <!-- Filtered products -->
</div>
```

### Sort Dropdown

```liquid
<select
  name="sort_by"
  @change="$store.hydrator.fetch(
    '{{ collection.url }}?sort_by=' + $el.value,
    '{{ section.id }}',
    ['ProductGridContainer']
  )"
>
  <option value="manual">{{ 'collections.sorting.featured' | t }}</option>
  <option value="best-selling">{{ 'collections.sorting.best_selling' | t }}</option>
  <option value="price-ascending">{{ 'collections.sorting.price_ascending' | t }}</option>
  <option value="price-descending">{{ 'collections.sorting.price_descending' | t }}</option>
</select>
```

### Quick View Modal

```liquid
<button
  @click="
    $store.hydrator.fetch(
      '{{ product.url }}',
      'main-product',
      ['QuickViewContent']
    );
    $dispatch('open-modal', 'quick-view');
  "
>
  {{ 'products.quick_view' | t }}
</button>

<div x-data="{ open: false }" @open-modal.window="open = ($event.detail === 'quick-view')">
  <div x-show="open" id="QuickViewContent">
    <!-- Product details loaded here -->
  </div>
</div>
```

### Load More Button

```liquid
<button
  @click="$store.hydrator.fetch(
    '{{ collection.url }}?page=' + ({{ paginate.current_page }} + 1),
    '{{ section.id }}',
    ['ProductGridContainer']
  )"
  x-show="{{ paginate.next | json }}"
>
  {{ 'collections.load_more' | t }}
</button>
```

### Custom Event Listeners

Listen to hydrator events for custom behavior:

```javascript
// Show a toast notification on successful load
window.addEventListener("section:loading-success", (event) => {
  const { sectionId, slots } = event.detail;
  console.log(
    `Successfully updated ${slots.join(", ")} in section ${sectionId}`,
  );
});

// Handle errors
window.addEventListener("section:loading-error", (event) => {
  const { error } = event.detail;
  alert("Failed to load content. Please try again.");
  console.error("Hydration error:", error);
});

// Global loading state
window.addEventListener("section:loading-start", () => {
  document.body.classList.add("is-loading");
});

window.addEventListener("section:loading-end", () => {
  document.body.classList.remove("is-loading");
});
```

## Advanced Patterns

### Multiple Filters with Form

```liquid
<form
  action="{{ collection.url }}"
  method="get"
  x-data="{ updateFilters() {
    $store.hydrator.fetchForm(this.$el, '{{ section.id }}', ['ProductGridContainer', 'ActiveFilters'])
  }}"
>
  <fieldset>
    <legend>{{ 'products.facets.availability' | t }}</legend>
    <input type="checkbox" @change="updateFilters()" name="filter.v.availability" value="1">
    <label>{{ 'products.facets.in_stock' | t }}</label>
  </fieldset>

  <fieldset>
    <legend>{{ 'products.facets.price' | t }}</legend>
    <input type="checkbox" @change="updateFilters()" name="filter.v.price" value="under-50">
    <label>Under $50</label>
  </fieldset>
</form>
```

### Infinite Scroll

````liquid
<div
  x-data="{
    page: {{ paginate.current_page }},
    hasNext: {{ paginate.next | json }},
    localLoading: false
  }"
  x-intersect:enter.threshold.50="
    if (hasNext && !localLoading) {
      localLoading = true;
      $store.hydrator.fetch(
        '{{ collection.url }}?page=' + (page + 1),
        '{{ section.id }}',
        ['ProductGridContainer']
      ).then(() => {
        page++;
        localLoading = false;

### Conditional Slot Updates

Only update specific slots based on user action:

```liquid
<button
  @click="
    const slots = $el.dataset.updateCount === 'true'
      ? ['ProductGridContainer', 'ProductCount']
      : ['ProductGridContainer'];
    $store.hydrator.fetch('{{ collection.url }}', '{{ section.id }}', slots);
  "
  data-update-count="true"
>
  Refresh with count
</button>
````

## Best Practices

1. **Always provide fallback URLs**: The href attribute ensures the page works without JavaScript
2. **Use `@click.prevent`**: Prevents default navigation when using AJAX
3. **Debounce user input**: Use `@input.debounce.500ms` for search inputs
4. **Provide loading feedback**: Use `$store.hydrator.isHydrating` to show loading states
5. **Keep slot IDs consistent**: Make sure the IDs you pass match actual elements in the DOM
6. **Handle errors gracefully**: Listen to `section:loading-error` events
7. **Test without JavaScript**: Ensure links work as regular page navigation

## Events Reference

| Event                     | When Fired                          | Detail Payload                     |
| ------------------------- | ----------------------------------- | ---------------------------------- |
| `section:loading-start`   | Before fetch begins                 | `{ url, sectionId, slots }`        |
| `section:loading-success` | After successful update             | `{ url, sectionId, slots }`        |
| `section:loading-error`   | When fetch fails                    | `{ url, sectionId, slots, error }` |
| `section:loading-end`     | After completion (success or error) | `{ url, sectionId, slots }`        |

## Store Methods

### `$store.hydrator.fetch(url, sectionId, slots)`

- **url** (string): Target URL to fetch
- **sectionId** (string): Shopify section ID
- **slots** (array): Element IDs to update

### `$store.hydrator.fetchForm(form, sectionId, slots)`

- **form** (HTMLFormElement): Form element with action and inputs
- **sectionId** (string): Shopify section ID
- **slots** (array): Element IDs to update

### `$store.hydrator.isLoading()`

- Returns current hydration state (boolean)
- Access directly via `$store.hydrator.isHydrating` for reactive templates
