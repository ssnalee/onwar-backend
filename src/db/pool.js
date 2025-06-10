import dotenv from 'dotenv';
import pkg from 'pg';

/**
 * DB 연결 관리
 * pg -> pool 인스턴스를 만들어서 재사용 가능하게 export 
 */
dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

export default pool;