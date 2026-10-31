import { expect, test } from '@playwright/test';

test('el catálogo muestra publicaciones y permite abrir su detalle', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: '¿Qué necesitas encontrar hoy en Manta?' })).toBeVisible();
  const panela = page.getByRole('link', { name: /Panela orgánica/ });
  await expect(panela).toBeVisible();
  await panela.click();

  await expect(page).toHaveURL(/\/oferta\/\d+$/);
  await expect(page.getByRole('heading', { name: 'Panela orgánica' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ver perfil y calificar ★' })).toBeVisible();
});

test('la búsqueda filtra publicaciones y conserva el término en la URL', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Buscar producto o servicio…' }).fill('Panela');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();

  await expect(page).toHaveURL(/\/\?q=Panela$/);
  await expect(page.getByRole('heading', { name: 'Resultados para “Panela”' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Panela orgánica/ })).toBeVisible();
});

test('una sesión cerrada no puede abrir una sección privada', async ({ page }) => {
  await page.goto('/favoritos');

  await expect(page).toHaveURL(/\/ingresar$/);
  await expect(page.getByRole('heading', { name: 'Ingresar a tu cuenta' })).toBeVisible();
});

test('el administrador inicia sesión y accede al panel', async ({ page }) => {
  await page.goto('/ingresar');
  await page.getByLabel('Correo electrónico').fill(process.env.MANTALINK_ADMIN_EMAIL ?? 'admin@mail.com');
  await page.getByLabel('Contraseña').fill(process.env.MANTALINK_ADMIN_PASSWORD ?? 'admin');
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: 'Panel de administración' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Balanced Scorecard' })).toBeVisible();
});
