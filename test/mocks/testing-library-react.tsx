import { StrictMode, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

type HookCallback<TValue> = () => TValue;

type RenderHookResult<TValue> = {
  result: {
    current: TValue;
  };
  rerender: () => void;
  unmount: () => void;
};

export const renderHook = <TValue,>(callback: HookCallback<TValue>): RenderHookResult<TValue> => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const state: { current: TValue | undefined } = { current: undefined };

  const TestComponent = (): ReactElement | null => {
    state.current = callback();
    return null;
  };

  const render = () => {
    act(() => {
      root.render(
        <StrictMode>
          <TestComponent />
        </StrictMode>,
      );
    });
  };

  render();

  return {
    result: {
      get current() {
        return state.current as TValue;
      },
      set current(value: TValue) {
        state.current = value;
      },
    },
    rerender: render,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
};
