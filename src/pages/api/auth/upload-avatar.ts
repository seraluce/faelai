// src/pages/api/auth/upload-avatar.ts
// 功能：头像上传 API — POST 上传图片文件，更新用户 avatarUrl
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { uploadAvatar } from '@/lib/utils/upload';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: '未登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: '请使用 multipart/form-data 格式上传' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File | null;

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: '请选择要上传的头像文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ error: '仅支持 JPG、PNG、WebP、GIF 格式' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (file.size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: '文件大小不能超过 5MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const avatarUrl = await uploadAvatar(file, user.id);

    await db
      .update(schema.users)
      .set({ avatarUrl, updatedAt: new Date() })
      .where(eq(schema.users.id, user.id));

    return new Response(JSON.stringify({ success: true, avatarUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    const message = error instanceof Error ? error.message : '头像上传失败，请稍后重试';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
