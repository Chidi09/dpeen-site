import { expect, test } from '@playwright/test';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../api/contact';

async function submit(
  body: unknown,
  origin = 'https://www.dpeenetwork.com',
  method = 'POST',
) {
  let status = 0;
  let payload: unknown;
  const req = {
    method,
    body,
    headers: {
      host: 'www.dpeenetwork.com',
      origin,
      'content-type': 'application/json',
    },
  } as VercelRequest;
  const res = {
    setHeader() {},
    status(code: number) {
      status = code;
      return this;
    },
    json(value: unknown) {
      payload = value;
      return this;
    },
  } as unknown as VercelResponse;
  await handler(req, res);
  return { status, payload };
}

test('contact rejects invalid, foreign and bot submissions without SMTP', async () => {
  const body = {
    fullName: 'Test Visitor',
    email: 'visitor@example.com',
    interest: 'General enquiry',
    message: 'Hello',
  };
  expect((await submit({ ...body, email: 'invalid' })).status).toBe(400);
  expect((await submit(body, 'https://other.example')).status).toBe(403);
  expect((await submit(body, 'malformed')).status).toBe(403);
  expect((await submit({ ...body, website: 'bot' })).status).toBe(400);
  expect((await submit(body, undefined, 'GET')).status).toBe(405);
  const previous = process.env.SMTP_PASSWORD;
  delete process.env.SMTP_PASSWORD;
  try {
    expect((await submit(body)).status).toBe(503);
  } finally {
    if (previous !== undefined) process.env.SMTP_PASSWORD = previous;
  }
});
