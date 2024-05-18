import * as dotenv from "dotenv";
/**
 * Environment object interface.
 */
export interface IEnv {
  APP_ENV: string;
  APP_SECRET: string;
  APP_URL: string;
  LOG_TARGET: string;

  API_HOST: string;
  API_PORT: number;

  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_DB: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_POOL: number;

  PAGE_DEFAULT_LIMIT: number;
  PAGE_MAX_LIMIT: number;

  APP_URL_BASE: string;

  MYSQL_HOST_TEST: string;
  MYSQL_PORT_TEST: number;
  MYSQL_DB_TEST: string;
  MYSQL_USER_TEST: string;
  MYSQL_PASSWORD_TEST: string;
  MYSQL_POOL_TEST: number;
}
/**
 * Load variables from .env.
 */
dotenv.config();

/**
 * Environment variables
 */
export const env = {
  /**
   * Application environment info.
   */
  APP_ENV: process.env["APP_ENV"] || "development",
  APP_SECRET: process.env["APP_SECRET"] || "notasecret",
  APP_URL: process.env["APP_URL"] || "http://localhost:8000",

  /**
   * Log writing destination.
   */
  LOG_TARGET: process.env["LOG_TARGET"] || "console",

  /**
   * HTTP server hostname and port.
   */
  API_HOST: process.env["API_HOST"] || "127.0.0.1",
  API_PORT: parseInt(process.env["API_PORT"]) || 3000,

  /**
   * Url base for FE.
   */
  APP_URL_BASE: process.env["APP_URL_BASE"],

  /**
   * Mysql URL.
   */
  MYSQL_HOST: process.env["MYSQL_HOST"],
  MYSQL_PORT: parseInt(process.env["MYSQL_PORT"]) || 3306,
  MYSQL_DB: process.env["MYSQL_DB"],
  MYSQL_USER: process.env["MYSQL_USER"],
  MYSQL_PASSWORD: process.env["MYSQL_PASSWORD"],
  MYSQL_POOL: parseInt(process.env["MYSQL_POOL"]),

  /**
   * Pagination default size limit.
   */
  PAGE_DEFAULT_LIMIT: parseInt(process.env["PAGE_DEFAULT_LIMIT"]) || 100,

  /**
   * Pagination maximum size limit.
   */
  PAGE_MAX_LIMIT: parseInt(process.env["PAGE_MAX_LIMIT"]),

  /**
   * Mysql test URL.
   */
  MYSQL_HOST_TEST: process.env["MYSQL_HOST_TEST"],
  MYSQL_PORT_TEST: parseInt(process.env["MYSQL_PORT_TEST"]) || 3306,
  MYSQL_DB_TEST: process.env["MYSQL_DB_TEST"],
  MYSQL_USER_TEST: process.env["MYSQL_USER_TEST"],
  MYSQL_PASSWORD_TEST: process.env["MYSQL_PASSWORD_TEST"],
  MYSQL_POOL_TEST: parseInt(process.env["MYSQL_POOL_TEST"]),
  CONTRACT_ID: process.env['CONTRACT_ID'],
  SIGNER_PRIVATE_KEY: process.env['SIGNER_PRIVATE_KEY'],
};
