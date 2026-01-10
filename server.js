// 간단한 HTTP 서버: localhost:3001에서 동작하며 JSON 응답을 반환합니다.
// package.json이 "type": "module"이라 ES Module 문법을 사용합니다.
import http from 'http';

const PORT = 3001;

const handler = (req, res) => {
  const body = JSON.stringify({ message: 'nolzaGo front test server running', path: req.url });
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
};

const server = http.createServer(handler);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server listening on http://localhost:${PORT}`);
});
