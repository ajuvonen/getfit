import {describe, it, expect, beforeEach, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {VCard} from 'vuetify/components';
import {useAppStateStore} from '@/stores/appState';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

describe('ConfirmDialog', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  it('mounts', () => {
    appStateStore.confirmText = 'Are you sure?';
    appStateStore.confirmDialogOpen = true;
    const wrapper = mount(ConfirmDialog);
    expect(wrapper.findComponent(VCard).html()).toMatchSnapshot();
  });

  it('confirm works', async () => {
    appStateStore.confirmText = 'Are you sure?';
    appStateStore.confirmDialogOpen = true;
    appStateStore.confirmAction = vi.fn();
    const wrapper = mount(ConfirmDialog);
    await wrapper.findComponent(VCard).findByTestId('confirm-dialog-confirm-button').trigger('click');
    expect(appStateStore.confirmAction).toHaveBeenCalledOnce();
    expect(appStateStore.confirmDialogOpen).toBe(false);
  });

  it('cancel works', async () => {
    appStateStore.confirmText = 'Are you sure?';
    appStateStore.confirmDialogOpen = true;
    appStateStore.confirmAction = vi.fn();
    const wrapper = mount(ConfirmDialog);
    await wrapper.findComponent(VCard).findByTestId('confirm-dialog-cancel-button').trigger('click');
    expect(appStateStore.confirmAction).toHaveBeenCalledTimes(0);
    expect(appStateStore.confirmDialogOpen).toBe(false);
  });
});
