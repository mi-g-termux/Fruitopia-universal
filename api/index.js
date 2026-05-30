// Vercel single serverless function — wraps the shared Express app.
// All /api/* routes (and /firebase-config.json) funnel through this one function,
// so we never hit Vercel Hobby's 12-function cap.
import serverless from 'serverless-http';
import { createApp } from '../app.mjs';

let cached;
async function getHandler() {
  if (!cached) cached = serverless(await createApp());
  return cached;
}
export default async function handler(req, res) {
  const h = await getHandler();
  return h(req, res);
}
