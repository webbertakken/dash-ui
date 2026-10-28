import '@testing-library/jest-dom/vitest'

// jsdom does not implement matchMedia; supply a benign stub
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}

// jsdom lacks ResizeObserver; many chart components rely on it
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error stub
  globalThis.ResizeObserver = ResizeObserverStub
}

// jsdom lacks IntersectionObserver
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
    root = null
    rootMargin = ''
    thresholds = []
  }
  // @ts-expect-error stub
  globalThis.IntersectionObserver = IntersectionObserverStub
}

// jsdom lacks scrollIntoView on Element
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {}
}

// jsdom lacks PointerEvent; without it `pointerType` is dropped from the
// event init and touch-vs-mouse overlay behaviour cannot be exercised.
if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
  class PointerEventStub extends MouseEvent {
    readonly pointerType: string
    readonly pointerId: number
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init)
      this.pointerType = init.pointerType ?? ''
      this.pointerId = init.pointerId ?? 0
    }
  }
  // @ts-expect-error stub
  window.PointerEvent = PointerEventStub
}
