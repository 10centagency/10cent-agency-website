// @vitest-environment happy-dom
import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Turnstile, { TurnstileRef } from '@/components/Turnstile';

describe('Turnstile Component (components/Turnstile.tsx)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = '1x00000000000000000000AA';
  });

  it('1. reserves 65px minHeight by default for flexible size to prevent layout shift', () => {
    const { container } = render(
      <Turnstile onSuccess={vi.fn()} action="contact_form" />
    );

    const turnstileWrapper = container.querySelector('.turnstile-container') as HTMLElement;
    expect(turnstileWrapper).toBeDefined();
    expect(turnstileWrapper.style.minHeight).toBe('65px');
    expect(turnstileWrapper.style.display).toBe('flex');
    expect(turnstileWrapper.style.alignItems).toBe('center');
  });

  it('2. reserves 140px minHeight when size="compact"', () => {
    const { container } = render(
      <Turnstile onSuccess={vi.fn()} size="compact" action="contact_form" />
    );

    const turnstileWrapper = container.querySelector('.turnstile-container') as HTMLElement;
    expect(turnstileWrapper).toBeDefined();
    expect(turnstileWrapper.style.minHeight).toBe('140px');
  });

  it('3. does not remove or recreate widget when parent re-renders with new inline callbacks', () => {
    const mockRemove = vi.fn();
    const mockRender = vi.fn().mockReturnValue('mock-widget-id-123');

    // Simulate browser window.turnstile in non-test mode
    (process.env as any).NODE_ENV = 'development';
    (window as any).turnstile = {
      render: mockRender,
      remove: mockRemove,
      reset: vi.fn(),
    };

    function ParentWrapper() {
      const [count, setCount] = useState(0);
      return (
        <div>
          <button onClick={() => setCount((c) => c + 1)}>Trigger Parent Render</button>
          {/* Passing inline callback that creates a brand new function reference on each render */}
          <Turnstile
            action="contact_form"
            onSuccess={() => {}}
            onError={() => {}}
            onExpire={() => {}}
          />
        </div>
      );
    }

    render(<ParentWrapper />);

    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRemove).not.toHaveBeenCalled();

    // Trigger parent re-render multiple times
    const btn = screen.getByText('Trigger Parent Render');
    act(() => {
      btn.click();
      btn.click();
      btn.click();
    });

    // Verify widget was NOT removed or recreated
    expect(mockRemove).not.toHaveBeenCalled();
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('4. passes size, appearance, and execution config to window.turnstile.render', () => {
    const mockRender = vi.fn().mockReturnValue('mock-widget-id-456');

    (process.env as any).NODE_ENV = 'development';
    (window as any).turnstile = {
      render: mockRender,
      remove: vi.fn(),
      reset: vi.fn(),
    };

    render(
      <Turnstile
        action="contact_form"
        size="flexible"
        appearance="always"
        execution="render"
        theme="dark"
        onSuccess={vi.fn()}
      />
    );

    expect(mockRender).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        sitekey: '1x00000000000000000000AA',
        action: 'contact_form',
        size: 'flexible',
        appearance: 'always',
        execution: 'render',
        theme: 'dark',
      })
    );
  });
});
