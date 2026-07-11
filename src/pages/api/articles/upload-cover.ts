// src/pages/api/articles/upload-cover.ts
// 功能：文章封面图上传 API -- POST 上传图片至 R2 或本地存储
import type { APIRoute } from 'astro';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const R2 = {
  accountId: import.meta.env.R2_ACCOUNT_ID,
  accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
  bucketName: import.meta.env.R2_BUCKET_NAME,
  publicUrl: import.meta.env.R2_PUBLIC_URL,
};

function isR2Configured(): boolean {
  return !!(R2.accountId && R2.accessKeyId && R2.secretAccessKey && R2.bucketName && R2.publicUrl);
}

function getExtension(file: File): string {
  const parts = file.name.split('.');
  if (parts.length < 2) return 'jpg';
  const ext = parts[parts.length - 1].toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext) ? ext : 'jpg';
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  };
  return map[ext] || 'image/jpeg';
}

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
    const file = formData.get('cover') as File | null;

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: '请选择要上传的封面图文件' }), {
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
      return new Response(JSON.stringify({ error: '文件大小不能超过 10MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ext = getExtension(file);
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const mimeType = getMimeType(ext);
    const buffer = await file.arrayBuffer();

    let url: string;

    if (isR2Configured()) {
      const s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${R2.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: R2.accessKeyId,
          secretAccessKey: R2.secretAccessKey,
        },
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: R2.bucketName,
          Key: `covers/${filename}`,
          Body: new Uint8Array(buffer),
          ContentType: mimeType,
        })
      );

      url = `${R2.publicUrl}/covers/${filename}`;
    } else {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'covers');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(buffer));
      url = `/uploads/covers/${filename}`;
    }

    return new Response(JSON.stringify({ success: true, url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload cover error:', error);
    return new Response(JSON.stringify({ error: '封面图上传失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
