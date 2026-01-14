import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const { type, data } = await req.json();
        let filePath;

        if (type === 'inventory') {
            filePath = path.join(process.cwd(), 'src/data/inventory.json');
        } else if (type === 'meals') {
            filePath = path.join(process.cwd(), 'src/data/meals.json');
        } else if (type === 'plans') {
            filePath = path.join(process.cwd(), 'src/data/meal_plans.json');
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, message: `Updated ${type} successfully` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        let filePath;

        if (type === 'inventory') {
            filePath = path.join(process.cwd(), 'src/data/inventory.json');
        } else if (type === 'meals') {
            filePath = path.join(process.cwd(), 'src/data/meals.json');
        } else if (type === 'plans') {
            filePath = path.join(process.cwd(), 'src/data/meal_plans.json');
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(fileContent));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}
