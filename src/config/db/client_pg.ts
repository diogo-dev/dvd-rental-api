import { Client } from 'pg';
import 'dotenv/config';

export const client_options_config = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
}

const client = new Client(client_options_config);

client.connect()
  .then(() => console.log("Connected to database.\n"))
  .catch(error => console.log("Connection failed.\n", error));

export default client;