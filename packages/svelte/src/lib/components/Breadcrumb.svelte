<script module lang="ts">
  export interface BreadcrumbItem { label: string; href?: string; }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  interface Props {
    items?: BreadcrumbItem[];
    class?: string;
  }

  let { items = [], class: className = '' }: Props = $props();
  
  const dispatch = createEventDispatcher<{ navigate: number }>();
</script>

<nav aria-label="Breadcrumb" class="breadcrumb {className}">
  <ol class="breadcrumb__list">
    {#each items as item, i}
      {@const isLast = i === items.length - 1}
      <li class="breadcrumb__item">
        {#if isLast}
          <span aria-current="page" class="breadcrumb__current">{item.label}</span>
        {:else if item.href}
          <a href={item.href} class="breadcrumb__link">{item.label}</a>
        {:else}
          <button type="button" class="breadcrumb__link" onclick={() => dispatch('navigate', i)}>{item.label}</button>
        {/if}
        {#if !isLast}
          <span aria-hidden="true" class="breadcrumb__sep">/</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
