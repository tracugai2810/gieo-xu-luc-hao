module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                const params = new URLSearchParams(body);
                body = Object.fromEntries(params);
            }
        }

        let base64Data = (body && body.image) ? body.image : '';
        let filename = (body && body.filename) ? body.filename : 'que_luc_hao.png';

        if (!base64Data) {
            return res.status(400).send('Missing image data');
        }

        // Bỏ tiền tố Data URL và chuyển các ký tự khoảng trắng thành dấu '+' (do URL decoding chuyển '+' thành khoảng trắng)
        const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '').replace(/ /g, '+');
        const buffer = Buffer.from(cleanBase64, 'base64');
        const safeFilename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.status(200).send(buffer);
    } catch (err) {
        console.error('Download API error:', err);
        return res.status(500).send('Internal Server Error');
    }
};
