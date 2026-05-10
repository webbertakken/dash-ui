<script context="module" lang="ts">
  export interface TimelineEvent {
    id: string;
    title: string;
    description?: string;
    time: string;
    variant?: 'info' | 'warn' | 'danger' | 'success' | 'neutral';
  }
</script>

<script lang="ts">
  export let events: TimelineEvent[];
  let className = '';
  export { className as class };
</script>

<ol class="timeline {className}" aria-label="Event timeline">
  {#each events as e (e.id)}
    <li class="timeline__item timeline__item--{e.variant ?? 'neutral'}">
      <span class="timeline__dot" aria-hidden="true"></span>
      <div class="timeline__content">
        <div class="timeline__header">
          <span class="timeline__title">{e.title}</span>
          <time class="timeline__time">{e.time}</time>
        </div>
        {#if e.description}
          <p class="timeline__desc">{e.description}</p>
        {/if}
      </div>
    </li>
  {/each}
</ol>
