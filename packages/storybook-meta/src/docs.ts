// Component descriptions shared by all three Storybooks. A component listed
// here gets an autodocs page carrying this text in React, Svelte and WC alike.
// The overlay entries state the canonical terminology (see Foundations / Overlays).

export const COMPONENT_DOCS: Record<string, string> = {
  Tooltip:
    'The **name** of a control: short, plain, non-interactive text. Opens after **1 s** of hover, **instantly** on keyboard focus, and on a touch long-press; closes on pointer leave, blur, `Escape` or pressing the control. Never the only carrier of meaning: an icon-only control inside is named after the tooltip, a control with its own name keeps it. Replaces the native `title` attribute. Rich content belongs in a HoverCard; interactive content in a Popover.',
  HoverCard:
    'Rich, **non-essential** content about its trigger: a bold `heading`, a `description`, and optional rich `content` (preview, key/value rows). Opens **instantly** on hover and keyboard focus; hoverable, and dismissible with `Escape`. Everything in it must also be reachable elsewhere. A control\u2019s name belongs in a Tooltip; interactive content in a Popover.',
  Popover:
    'A **click-opened**, interactive surface anchored to its trigger: menus, pickers, filters. Focus moves into the panel and returns to the trigger; closes on outside click and `Escape`. For a control\u2019s name use a Tooltip; for read-only extra detail on hover use a HoverCard.',
}

export function docsFor(component: string): string | undefined {
  return COMPONENT_DOCS[component]
}

/** Source for the `parameters` (and `tags`) of a generated story's meta. */
export function storyMetaFields(component: string): string {
  const docs = docsFor(component)
  if (!docs) return `parameters: { layout: 'padded' },`
  return `parameters: {
    layout: 'padded',
    docs: { description: { component: ${JSON.stringify(docs)} } },
  },
  tags: ['autodocs'],`
}
