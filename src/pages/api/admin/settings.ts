// src/pages/api/admin/settings.ts
// 功能：站点设置 API — GET 获取所有设置、PUT 更新设置（管理员）
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  try {
    const rows = await db.select().from(schema.siteSettings);
    const settings: Record<string, string> = {};
    for (const row of rows) {
      if (row.value !== null) settings[row.key] = row.value;
    }
    return new Response(JSON.stringify({ settings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return new Response(JSON.stringify({ error: '获取设置失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user || user.role !== 'admin') {
      return new Response(JSON.stringify({ error: '权限不足' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return new Response(JSON.stringify({ error: '参数错误' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    for (const [key, value] of Object.entries(settings)) {
      const existing = await db
        .select()
        .from(schema.siteSettings)
        .where(eq(schema.siteSettings.key, key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(schema.siteSettings)
          .set({ value: String(value), updatedAt: new Date() })
          .where(eq(schema.siteSettings.key, key));
      } else {
        await db.insert(schema.siteSettings).values({ key, value: String(value) });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return new Response(JSON.stringify({ error: '保存设置失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
