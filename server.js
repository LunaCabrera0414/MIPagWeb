const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const comentariosPath = path.join(__dirname, 'comentarios.json');

function servirArchivo(res, filePath, tipo) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end('Archivo no encontrado');
        }
        res.writeHead(200, { 'Content-Type': tipo });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    console.log(`📥 ${req.method} ${req.url}`);

    // 🔧 Sirve archivos estáticos
    const extTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.svg': 'image/svg+xml'
    };

    const ruta = path.join(__dirname, req.url);
    const ext = path.extname(ruta);

    if (extTypes[ext]) {
        return servirArchivo(res, ruta, extTypes[ext]);
    }

    // 📥 Manejo de rutas
    if (req.method === 'GET') {
        if (req.url === '/' || req.url === '/index.html') {
            servirArchivo(res, path.join(__dirname, 'index.html'), 'text/html');
        } else if (req.url === '/index.js') {
            servirArchivo(res, path.join(__dirname, 'index.js'), 'application/javascript');
        } else if (req.url === '/comentarios') {
            // Leer y devolver el archivo JSON con comentarios
            fs.readFile(comentariosPath, (err, data) => {
                if (err) {
                    // Si no existe o hay error, devolver array vacío
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify([]));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        } else {
            res.writeHead(404);
            res.end('Ruta no encontrada');
        }

    } else if (req.method === 'POST' && req.url === '/comentarios') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            let nuevoComentario;

            try {
                nuevoComentario = JSON.parse(body);
            } catch {
                res.writeHead(400);
                return res.end('JSON inválido');
            }

            fs.readFile(comentariosPath, (err, data) => {
                let comentarios = [];

                if (!err) {
                    try {
                        comentarios = JSON.parse(data);
                        if (!Array.isArray(comentarios)) comentarios = [];
                    } catch {
                        comentarios = [];
                    }
                }

                comentarios.unshift(nuevoComentario);

                fs.writeFile(comentariosPath, JSON.stringify(comentarios, null, 2), err => {
                if (err) {
                    console.error("Error al escribir en comentarios.json:", err);
                    res.writeHead(500);
                    return res.end('Error interno del servidor');
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok' }));
                });
            });
        });

    } else {
        res.writeHead(405);
        res.end('Método no permitido');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
