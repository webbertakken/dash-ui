<script lang="ts">
  import { Button, SearchBox, Tabs, Signal } from '@dash-ui/svelte';
  import { CLIENTS } from '../data';
  let tab = 'all';
</script>

<div class="ph-bar">
  <div class="ph-title">Client Devices · 142</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search clients…" />
    <Button>Filter</Button>
  </div>
</div>
<Tabs
  bind:active={tab}
  items={[
    { id: 'all', label: 'All', badge: 142 },
    { id: 'wired', label: 'Wired', badge: 42 },
    { id: 'wireless', label: 'Wireless', badge: 88 },
    { id: 'vpn', label: 'VPN', badge: 12 },
    { id: 'guest', label: 'Guest', badge: 7 },
  ]}
/>
<div style="padding:0 24px 24px;">
  <table style="background:#141415;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">
    <thead>
      <tr>
        <th>Name</th>
        <th>IP / MAC</th>
        <th>Network</th>
        <th>Connected to</th>
        <th style="text-align:right;">RX / TX</th>
        <th style="text-align:right;">Signal</th>
      </tr>
    </thead>
    <tbody>
      {#each CLIENTS as c (c[2])}
        <tr>
          <td style="color:#fff;">{c[0]}</td>
          <td>
            <div class="mac">{c[1]}</div>
            <div class="mac" style="font-size:10px;color:#4A4B53;">{c[2]}</div>
          </td>
          <td style="color:#A4A7B5;">{c[3]} · {c[4]}</td>
          <td style="color:#A4A7B5;">{c[5]}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{c[6]}</td>
          <td style="text-align:right;">
            {#if c[7]}<Signal weak={c[7] === 'weak'} />{:else}—{/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
