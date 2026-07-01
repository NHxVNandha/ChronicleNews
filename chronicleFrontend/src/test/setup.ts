import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  configurable: true,
  value: () => {},
});
