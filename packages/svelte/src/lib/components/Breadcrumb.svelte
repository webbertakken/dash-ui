<script module lang="ts">
  export interface BreadcrumbItem { label: string; href?: string }
</script>

<script lang="ts">
  interface Props {
    items?: BreadcrumbItem[];
    class?: string;
    onnavigate?: (payload: number) => void;
  }

  let { items = [], class: className = '', onnavigate }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class={className}>
  <ol class="m-0 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 p-0 text-12 [list-style:none]">
    {#each items as item, i}
      {@const isLast = i === items.length - 1}
      <li class="flex items-center gap-1.5">
        {#if isLast}
          <span
            aria-current="page"
            class="font-medium text-[#c8c9d0]"
          >{item.label}</span>
        {:else if item.href}
          <a
            href={item.href}
            class="cursor-pointer text-neutral-05 no-underline transition-colors duration-100 hover:text-[#c8c9d0] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
          >{item.label}</a>
        {:else}
          <button
            type="button"
            class="cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-neutral-05 transition-colors duration-100 hover:text-[#c8c9d0] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
            onclick={() => onnavigate?.(i)}
          >{item.label}</button>
        {/if}
        {#if !isLast}
          <span class="select-none text-[#3e3e45]" aria-hidden="true">/</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
