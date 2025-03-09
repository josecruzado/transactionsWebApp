import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET() {
    try {
        const response = await fetch(`${API_URL}/transactions/summary`);

        if (!response.ok) {
            throw new Error('Error al obtener el resumen');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}