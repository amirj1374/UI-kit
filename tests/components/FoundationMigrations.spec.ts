import DownloadButton from '../../src/components/shared/DownloadButton.vue';
import BaseBreadcrumb from '../../src/components/shared/BaseBreadcrumb.vue';
import { mountWithApp } from '../utils/mount';

describe('stabilized shared component migrations', () => {
  it('localizes DownloadButton without changing explicit title precedence', () => {
    const english = mountWithApp(DownloadButton, { props: { url: '/file', title: 'Export' } }, undefined, { locale: 'en-US' }).wrapper;
    expect(english.text()).toContain('Export'); expect(english.find('.download-button').attributes('dir')).toBe('ltr');
    const fallback = mountWithApp(DownloadButton, { props: { url: '/file' } }, undefined, { locale: 'en-US' }).wrapper;
    expect(fallback.text()).toContain('Download');
  });

  it('applies provider direction to BaseBreadcrumb without changing its props', () => {
    const { wrapper } = mountWithApp(BaseBreadcrumb, { props: { title: 'Page', breadcrumbs: [] } }, undefined, { direction: 'ltr' });
    expect(wrapper.find('.page-breadcrumb').attributes('dir')).toBe('ltr'); expect(wrapper.text()).toContain('Page');
  });
});
