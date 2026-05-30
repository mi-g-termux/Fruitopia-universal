// Netlify single function wrapper for the shared Express app.
import serverless from 'serverless-http';
import { createApp } from '../../app.mjs';

let cached;
export const handler = async (event, context) => {
  if (!cached) cached = serverless(await createApp());
  return cached(event, context);
};
