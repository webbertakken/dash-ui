<script lang="ts">
  interface Props {
    slides?: Array<{ id: string; title: string; description?: string; color?: string }>;
    label: string;
    class?: string;
  }

  let { slides = [], label, class: klass = '' }: Props = $props();

  let index = $state(0);

  function prev() {
    index = (index - 1 + slides.length) % slides.length;
  }
  function next() {
    index = (index + 1) % slides.length;
  }
</script>

<section
  class="relative overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] {klass}"
  aria-roledescription="carousel"
  aria-label={label}
>
  <div class="relative min-h-[140px]" aria-live="polite" aria-atomic="false">
    {#each slides as slide, i (slide.id)}
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${i + 1} of ${slides.length}`}
        data-active={i === index ? 'true' : undefined}
        class="absolute inset-0 flex items-stretch gap-3 p-4 opacity-0 transition-opacity duration-200 data-[active=true]:opacity-100 data-[active=true]:relative"
        aria-hidden={i !== index ? true : undefined}
      >
        {#if slide.color}
          <div class="w-1 shrink-0 rounded" style="background:{slide.color}" aria-hidden="true"></div>
        {/if}
        <div class="min-w-0 flex-1">
          <div class="text-15 font-semibold text-white">{slide.title}</div>
          {#if slide.description}
            <div class="mt-1 text-13 text-text-3">{slide.description}</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <div class="flex items-center justify-between border-t border-white/[0.06] bg-[#0a0a0b] px-2 py-1.5">
    <button
      type="button"
      aria-label="Previous slide"
      class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#6e7079] hover:bg-white/[0.04] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      onclick={prev}
    >&#8249;</button>
    <div role="tablist" aria-label="Choose slide to display" class="flex items-center gap-1.5">
      {#each slides as slide, i (slide.id)}
        <button
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Slide ${i + 1}: ${slide.title}`}
          data-active={i === index ? 'true' : undefined}
          class="h-1.5 w-1.5 cursor-pointer rounded-full border-0 bg-white/20 transition-all duration-150 hover:bg-white/40 data-[active=true]:w-4 data-[active=true]:bg-brand-05"
          onclick={() => (index = i)}
        ></button>
      {/each}
    </div>
    <button
      type="button"
      aria-label="Next slide"
      class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#6e7079] hover:bg-white/[0.04] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      onclick={next}
    >&#8250;</button>
  </div>
</section>
