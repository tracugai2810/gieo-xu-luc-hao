/**
 * API tải ảnh quẻ - cơ chế "gửi tạm, lấy bằng mã phiếu"
 *
 * Vì sao cần: Trình duyệt nhúng của Facebook / Messenger / Zalo trên Android không tự tải file.
 * Nó chỉ lấy ĐỊA CHỈ (URL) rồi giao cho trình tải xuống của Android (DownloadManager),
 * và trình này sẽ tự mở lại địa chỉ đó bằng GET. Vì vậy ảnh phải nằm ở một địa chỉ thật.
 *
 * Luồng:
 *   1. POST /api/download   (JSON { image: "<base64 PNG>" })
 *        -> lưu tạm ảnh vào Upstash Redis, tự xóa sau 10 phút -> trả về { id }
 *   2. GET  /api/download?id=<id>&name=<ten_file.png>
 *        -> trả file PNG kèm Content-Disposition: attachment để máy tải về
 *
 * Cấu hình (Vercel -> Storage -> Upstash for Redis), hỗ trợ 1 trong 2 bộ biến môi trường:
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *   KV_REST_API_URL        + KV_REST_API_TOKEN
 */

const crypto = require('crypto');

const TTL_SECONDS = 600;                 // Ảnh tự xóa sau 10 phút
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // Giới hạn 3MB / ảnh (ảnh quẻ thực tế ~150-300KB)
const KEY_PREFIX = 'gieoque:img:';
const ID_PATTERN = /^[a-f0-9]{32}$/;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const DEFAULT_FILENAME = 'que_luc_hao.png';

function getRedisConfig() {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!url || !token) return null;
    return { url: url.replace(/\/+$/, ''), token };
}

async function redisCommand(cfg, command) {
    const response = await fetch(cfg.url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${cfg.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(command)
    });
    let data = null;
    try {
        data = await response.json();
    } catch (e) {
        data = null;
    }
    if (!response.ok || !data || data.error) {
        throw new Error(`Redis error: ${data && data.error ? data.error : response.status}`);
    }
    return data.result;
}

function parseBody(req) {
    let body = req.body;
    if (Buffer.isBuffer(body)) body = body.toString('utf8');
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            body = Object.fromEntries(new URLSearchParams(body));
        }
    }
    return body && typeof body === 'object' ? body : {};
}

/** Giải mã base64 ảnh, kiểm tra đúng là file PNG hợp lệ. Trả về Buffer hoặc null. */
function decodePng(rawImage) {
    if (typeof rawImage !== 'string' || !rawImage) return null;
    const cleanBase64 = rawImage
        .replace(/^data:image\/\w+;base64,/, '')
        .replace(/ /g, '+')      // form-urlencoded có thể biến '+' thành khoảng trắng
        .replace(/[\r\n\t]/g, '');
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64)) return null;
    const buffer = Buffer.from(cleanBase64, 'base64');
    if (buffer.length < PNG_SIGNATURE.length || buffer.length > MAX_IMAGE_BYTES) return null;
    if (!buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) return null;
    return buffer;
}

function sanitizeFilename(name) {
    if (typeof name !== 'string') return DEFAULT_FILENAME;
    const trimmed = name.trim();
    if (trimmed.length > 100 || !/^[A-Za-z0-9_\-]+\.png$/.test(trimmed)) return DEFAULT_FILENAME;
    return trimmed;
}

function sendPngAttachment(res, buffer, filename) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).end(buffer);
}

/**
 * Khi không lấy được ảnh: trả 204 (No Content).
 * Trình duyệt nhận 204 sẽ ĐỨNG YÊN ở trang hiện tại -> khách không bị mất quẻ đang xem.
 */
function sendNoContent(res) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(204).end();
}

async function handleUpload(req, res) {
    const body = parseBody(req);
    const contentType = String(req.headers['content-type'] || '');
    const buffer = decodePng(body.image);

    // Tương thích ngược: trang cũ (còn mở sẵn trên máy khách) gửi form -> trả file trực tiếp như trước
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        if (!buffer) return res.status(400).send('Invalid image data');
        return sendPngAttachment(res, buffer, sanitizeFilename(body.filename));
    }

    res.setHeader('Cache-Control', 'no-store');

    if (!buffer) {
        return res.status(400).json({ error: 'invalid_image' });
    }

    const cfg = getRedisConfig();
    if (!cfg) {
        console.error('Download API: chưa cấu hình Upstash Redis (UPSTASH_REDIS_REST_URL / KV_REST_API_URL)');
        return res.status(503).json({ error: 'storage_not_configured' });
    }

    const id = crypto.randomBytes(16).toString('hex');
    await redisCommand(cfg, ['SET', KEY_PREFIX + id, buffer.toString('base64'), 'EX', String(TTL_SECONDS)]);
    return res.status(200).json({ id, expiresIn: TTL_SECONDS });
}

async function handleFetch(req, res) {
    const query = req.query || {};
    const id = typeof query.id === 'string' ? query.id : '';
    if (!ID_PATTERN.test(id)) return sendNoContent(res);

    const cfg = getRedisConfig();
    if (!cfg) return sendNoContent(res);

    // Không xóa ảnh sau lần đọc đầu: trên Android, WebView và DownloadManager có thể cùng mở địa chỉ này 2 lần.
    const storedBase64 = await redisCommand(cfg, ['GET', KEY_PREFIX + id]);
    if (!storedBase64 || typeof storedBase64 !== 'string') return sendNoContent(res);

    const buffer = Buffer.from(storedBase64, 'base64');
    return sendPngAttachment(res, buffer, sanitizeFilename(query.name));
}

module.exports = async (req, res) => {
    try {
        if (req.method === 'OPTIONS') {
            return res.status(204).end();
        }
        if (req.method === 'POST') {
            return await handleUpload(req, res);
        }
        if (req.method === 'GET' || req.method === 'HEAD') {
            return await handleFetch(req, res);
        }
        res.setHeader('Allow', 'GET, HEAD, POST, OPTIONS');
        return res.status(405).send('Method Not Allowed');
    } catch (err) {
        console.error('Download API error:', err);
        if (res.headersSent) return res.end();
        if (req.method === 'GET' || req.method === 'HEAD') return sendNoContent(res);
        return res.status(500).json({ error: 'internal_error' });
    }
};
