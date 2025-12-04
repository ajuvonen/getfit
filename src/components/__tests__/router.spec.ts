import {describe, it, expect} from 'vitest';
import router from '@/router';

describe('Router', () => {
  it('includes all routes', () => {
    expect(router.options.routes).toHaveLength(5);
    expect(router.options.routes[0]!.path).toBe('/');
    expect(router.options.routes[0]!.name).toBe('home');
    expect(router.options.routes[1]!.path).toBe('/settings');
    expect(router.options.routes[1]!.name).toBe('settings');
    expect(router.options.routes[2]!.path).toBe('/stats');
    expect(router.options.routes[2]!.name).toBe('stats');
    expect(router.options.routes[3]!.path).toBe('/schedule');
    expect(router.options.routes[3]!.name).toBe('schedule');
    expect(router.options.routes[4]!.path).toBe('/export');
    expect(router.options.routes[4]!.name).toBe('export');
  });
});
