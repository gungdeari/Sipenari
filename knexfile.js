module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'new_password', 
      database: 'Balinese' 
    },
    migrations: {
      directory: './db/migrations',
    },
  },
};
