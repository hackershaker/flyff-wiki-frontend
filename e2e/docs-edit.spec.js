import { test, expect } from '@playwright/test'

test('user can open edit page and save a document', async ({ page }) => {
  await page.goto('/edit')

  await expect(
    page.getByRole('heading', { name: '문서 편집' })
  ).toBeVisible()

  await page.getByRole('button', { name: '문서 저장' }).click()

  await expect(page.getByRole('status')).toHaveText('문서를 저장했습니다.')
})
