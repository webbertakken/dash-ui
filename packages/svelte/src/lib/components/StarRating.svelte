<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    label: string;
    value?: number;
    max?: number;
    readOnly?: boolean;
    size?: 'sm' | 'md';
    onChange?: ((v: number) => void) | undefined;
  }

  let {
    label,
    value = $bindable(0),
    max = 5,
    readOnly = false,
    size = 'md',
    onChange = undefined,
  }: Props = $props();

  const gid = `dash-ui-sr-${++counter}`;
  let hovered = $state(0);

  function pick(star: number) {
    value = star;
    onChange?.(star);
  }

  const STAR_SIZE: Record<NonNullable<Props['size']>, string> = {
    sm: 'h-[15px] w-[15px]',
    md: 'h-5 w-5',
  };
</script>

{#if readOnly}
  <span
    class="m-0 inline-flex items-center gap-0.5 border-0 bg-transparent p-0"
    role="img"
    aria-label={`${value} out of ${max} stars`}
  >
    {#each Array(max) as _, i}
      {@const on = i < value}
      <span
        aria-hidden="true"
        class="flex items-center {on ? 'text-status-warning' : 'text-white/[0.18]'}"
      >
        <svg
          class={STAR_SIZE[size]}
          viewBox="0 0 24 24"
          fill={on ? 'currentColor' : 'none'}
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
          focusable="false"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </span>
    {/each}
  </span>
{:else}
  <fieldset class="m-0 inline-flex items-center gap-0.5 border-0 bg-transparent p-0">
    <legend class="sr-only">{label}</legend>
    {#each Array(max) as _, i}
      {@const star = i + 1}
      {@const on = star <= (hovered || value)}
      <label
        for="{gid}-{star}"
        class="group/star relative flex cursor-pointer items-center rounded-sm p-px transition-colors duration-100 {on ? 'text-status-warning' : 'text-white/[0.18]'} has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-05"
        onmouseenter={() => (hovered = star)}
        onmouseleave={() => (hovered = 0)}
      >
        <input
          type="radio"
          id="{gid}-{star}"
          name={gid}
          value={String(star)}
          checked={value === star}
          class="sr-only"
          aria-label={`${star} out of ${max}`}
          onchange={() => pick(star)}
        />
        <svg
          class={STAR_SIZE[size]}
          viewBox="0 0 24 24"
          fill={on ? 'currentColor' : 'none'}
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
          focusable="false"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </label>
    {/each}
  </fieldset>
{/if}
