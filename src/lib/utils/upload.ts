// src/lib/utils/upload.ts
// 功能：头像上传工具 — 校验图片类型与大小，上传至 R2 或本地 public/uploads/avatars/
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

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
  const name = file.name;
  const parts = name.split('.');
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

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return '不支持的文件类型，仅支持 JPG、PNG、WebP、GIF 格式';
  }
  if (file.size > MAX_SIZE) {
    return '文件大小不能超过 5MB';
  }
  return null;
}

async function uploadToR2(
  buffer: ArrayBuffer,
  filename: string,
  mimeType: string
): Promise<string> {
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
      Key: `avatars/${filename}`,
      Body: new Uint8Array(buffer),
      ContentType: mimeType,
    })
  );

  return `${R2.publicUrl}/avatars/${filename}`;
}

async function uploadToLocal(buffer: ArrayBuffer, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(buffer));
  return `/uploads/avatars/${filename}`;
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const validationError = validateFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const ext = getExtension(file);
  const filename = `${userId}-${Date.now()}.${ext}`;
  const mimeType = getMimeType(ext);
  const buffer = await file.arrayBuffer();

  if (isR2Configured()) {
    return uploadToR2(buffer, filename, mimeType);
  }

  return uploadToLocal(buffer, filename);
}
