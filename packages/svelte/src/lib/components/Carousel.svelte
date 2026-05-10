<script lang="ts">
  export let slides: Array<{ id: string; title: string; description?: string; color?: string }> =
    [];
  export let label: string;
  let klass = '';
  export { klass as class };

  let index = 0;

  function prev() {
    index = (index - 1 + slides.length) % slides.length;
  }
  function next() {
    index = (index + 1) % slides.length;
  }
</script>

<section
  class="carousel {klass}"
  aria-roledescription="carousel"
  aria-label={label}
>
  <div class="carousel-track" aria-live="polite" aria-atomic="false">
    {#each slides as slide, i (slide.id)}
      <div
        role="group"
        aria-roledescription="slide"
        aria-label="{i + 1} of {slides.length}"
        class="carousel-slide{i === index ? ' is-active' : ''}"
        aria-hidden={i !== index ? true : undefined}
      >
        {#if slide.color}
          <div class="carousel-slide-accent" style="background:{slide.color}" aria-hidden="true" />
        {/if}
        <div class="carousel-slide-body">
          <div class="carousel-slide-title">{slide.title}</div>
          {#if slide.description}
            <div class="carousel-slide-desc">{slide.description}</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-btn" aria-label="Previous slide" on:click={prev}
      >&#8249;</button
    >
    <div role="tablist" aria-label="Choose slide to display" class="carousel-indicators">
      {#each slides as slide, i (slide.id)}
        <button
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label="Slide {i + 1}: {slide.title}"
          class="carousel-dot{i === index ? ' is-active' : ''}"
          on:click={() => (index = i)}
        />
      {/each}
    </div>
    <button type="button" class="carousel-btn" aria-label="Next slide" on:click={next}
      >&#8250;</button
    >
  </div>
</section>
