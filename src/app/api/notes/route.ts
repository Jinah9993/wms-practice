import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// adding note
export async function POST(req: Request) {
  try {
    const { orderId, content } = await req.json();

    if (!orderId || !content) {
      return NextResponse.json({ success: false, error: 'orderId and content are required' }, { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO "Note" ("orderId", "content") VALUES ($1, $2) RETURNING *',
      [orderId, content]
    );
    client.release();

    return NextResponse.json({ success: true, message: 'Note added', newNote: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
