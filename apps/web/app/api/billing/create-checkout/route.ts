import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
    const url = `${BACKEND_URL}/api/v1/billing/create-checkout`;
    const body = await request.json();

    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Debug: log cookies
    console.log('📝 Forwarding cookies:', allCookies.map(c => c.name));

    const cookieHeader = allCookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        // Debug: log response
        console.log('📝 Backend response status:', response.status);
        console.log('📝 Backend response:', data);

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('❌ Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
