module.exports = {
  apps: [{
    name: 'bolivia-frontend',
    script: 'npx',
    args: 'react-scripts start',
    env: {
      PORT: 3000,
      REACT_APP_API_URL: '/api',
      NODE_ENV: 'development'
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    merge_logs: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};