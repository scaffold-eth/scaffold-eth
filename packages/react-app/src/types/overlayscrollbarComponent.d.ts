declare module 'overlayscrollbars-react' {}

export type OverlayScrollbarsComponentProps<T extends keyof JSX.IntrinsicElements = 'div'> =
  ComponentPropsWithoutRef<T> & {
    /** Tag of the root element. */
    element?: T
    /** OverlayScrollbars options. */
    options?: PartialOptions | false | null
    /** OverlayScrollbars events. */
    events?: EventListeners | false | null
    /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
    defer?: boolean | IdleRequestOptions
  }

export interface OverlayScrollbarsComponentRef<T extends keyof JSX.IntrinsicElements = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null
  /** Returns the root element. */
  getElement(): ElementRef<T> | null
}
