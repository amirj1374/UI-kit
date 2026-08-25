import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiChatMarkdown from './UiChatMarkdown.vue';

describe('UiChatMarkdown', () => {
  it.each([
    ['java', 'public class User {}'],
    ['javascript', 'const value = true;'],
    ['typescript', 'const value: string = "ok";'],
    ['csharp', 'public class User {}'],
    ['python', 'def hello():\n  return True']
  ])('highlights %s code without application dependencies', (language, code) => {
    const wrapper = mount(UiChatMarkdown, { props: { content: `\`\`\`${language}\n${code}\n\`\`\`` } });
    expect(wrapper.find('code').classes()).toContain(`language-${language}`);
    expect(wrapper.find('code').html()).toContain('hljs-');
  });

  it('does not render raw HTML from assistant output', () => {
    const wrapper = mount(UiChatMarkdown, { props: { content: '<script>alert(1)</script>' } });
    expect(wrapper.find('script').exists()).toBe(false);
    expect(wrapper.text()).toContain('<script>');
  });
});
