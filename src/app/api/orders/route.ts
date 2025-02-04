import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM "Order"'); // fetch data from Order table
    client.release();

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}


// DELETE order
export async function DELETE(req: Request) {
    try {
      const { id } = await req.json(); 
  
      if (!id) {
        return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
      }
  
      const client = await pool.connect();
      const result = await client.query('DELETE FROM "Order" WHERE id = $1 RETURNING *', [id]);
      client.release();
  
      if (result.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: 'Order deleted', deletedOrder: result.rows[0] });
    } catch (error) {
      return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
  }

  // POST (adding new order)
  export async function POST(req: Request) {
    try {
      const { orderNumber, customerName, status } = await req.json();
  
      if (!orderNumber || !customerName || !status) {
        return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
      }
  
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO "Order" ("orderNumber", "customerName", "status") VALUES ($1, $2, $3) RETURNING *',
        [orderNumber, customerName, status]
      );
      client.release();
  
      return NextResponse.json({ success: true, message: 'Order added', newOrder: result.rows[0] });
    } catch (error) {
      return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
  }

  // PUT (update status)
  export async function PUT(req: Request) {
    try {
      const { id, status } = await req.json();
  
      if (!id || !status) {
        return NextResponse.json({ success: false, error: 'ID and status are required' }, { status: 400 });
      }
  
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE "Order" SET "status" = $1 WHERE "id" = $2 RETURNING *',
        [status, id]
      );
      client.release();
  
      if (result.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: 'Order updated', updatedOrder: result.rows[0] });
    } catch (error) {
      return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
  }