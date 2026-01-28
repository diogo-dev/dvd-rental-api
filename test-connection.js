require('dotenv/config');
const { Client } = require('pg');

const config = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
};

console.log('Testing connection with:');
console.log('user:', JSON.stringify(config.user));
console.log('host:', JSON.stringify(config.host));
console.log('database:', JSON.stringify(config.database));
console.log('password:', JSON.stringify(config.password));
console.log('password length:', config.password?.length);
console.log('port:', config.port);

const client = new Client(config);

client.connect()
  .then(() => {
    console.log('\n✓ Connected successfully!');
    return client.end();
  })
  .catch(err => {
    console.log('\n✗ Connection failed:', err.message);
    process.exit(1);
  });
