import { test, expect } from '@playwright/test';
import { routing } from '@/i18n/routing';

test.describe('랜딩 페이지', () => {
  test('기본 언어 리다이렉팅', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(new RegExp(`/${routing.defaultLocale}$`));
  });

  test('푸터 언어 스위처로 한국어 페이지로 이동', async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByText('ABOUT SHATHING')).toBeVisible();
    const localeSelect = page.getByRole('combobox');
    await localeSelect.selectOption('ko');
    await expect(page).toHaveURL(/\/ko$/);
    await expect(page.getByText('샤딩 소개')).toBeVisible();
  });
});
