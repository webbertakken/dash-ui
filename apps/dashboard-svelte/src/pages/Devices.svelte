<script lang="ts">
  import { Button, SearchBox, Tabs, Signal, StatusIndicator } from '@dash-ui/svelte';
  import { DEVICES } from '../data';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ adopt: void }>();
  let tab = 'all';
</script>

<div class="ph-bar">
  <div class="ph-title">Devices</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search devices…" />
    <Button>Filter</Button>
    <Button variant="primary" on:click={() => dispatch('adopt')}>Adopt Device</Button>
  </div>
</div>
<Tabs
  bind:active={tab}
  items={[
    { id: 'all', label: 'All', badge: 12 },
    { id: 'gw', label: 'Gateways', badge: 1 },
    { id: 'sw', label: 'Switches', badge: 2 },
    { id: 'wifi', label: 'Wi-Fi', badge: 6 },
    { id: 'cam', label: 'Cameras', badge: 3 },
    { id: 'pending', label: 'Pending', badge: 1 },
  ]}
/>
<div style="padding:0 24px 24px;">
  <table style="background:#141415;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">
    <thead>
      <tr>
        <th>Name / Model</th>
        <th>MAC / IP</th>
        <th>Site</th>
        <th style="text-align:right;">Uptime</th>
        <th style="text-align:right;">Clients</th>
        <th style="text-align:right;">Signal</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each DEVICES as r (r[2])}
        <tr>
          <td>
            <div class="name-cell">
              <span class="nc-thumb">{r[9]}</span>
              <div>
                <div style="font-size:13px;color:#fff;">{r[0]}</div>
                <div class="mac" style="font-size:10px;">{r[1]}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="mac">{r[2]}</div>
            <div class="mac" style="font-size:10px;color:#4A4B53;">{r[3]}</div>
          </td>
          <td style="color:#A4A7B5;">Edge Gateway</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{r[4]}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{r[5]}</td>
          <td style="text-align:right;">
            {#if r[10]}<Signal weak={r[10] === 'weak'} />{:else}—{/if}
          </td>
          <td><StatusIndicator color={r[6]} text={r[7]} textColor={r[8]} /></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
