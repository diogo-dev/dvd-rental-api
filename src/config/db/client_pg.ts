import { Client } from 'pg';
import 'dotenv/config';

export const client_options_config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
}

const client = new Client(client_options_config);

client.connect()
  .then(() => console.log("Connected to database.\n"))
  .catch(error => console.log("Connection failed.\n", error));

export default client;