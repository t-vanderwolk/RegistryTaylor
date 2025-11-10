export function healthCheck(_req, res) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

export default healthCheck;
