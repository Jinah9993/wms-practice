import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const client = await pool.connect();
    
    const orderResult = await client.query('SELECT * FROM "Order" WHERE id = $1', [id]);
    
    const notesResult = await client.query('SELECT * FROM "Note" WHERE "orderId" = $1', [id]);

    client.release();

    if (orderResult.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: orderResult.rows[0],
      notes: notesResult.rows,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
