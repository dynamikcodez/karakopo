import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'src/data/inventory.json');

async function getInventory() {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
}

async function saveInventory(inventory) {
    await fs.writeFile(dataFile, JSON.stringify(inventory, null, 2));
}

export async function GET() {
    const inventory = await getInventory();
    return NextResponse.json(inventory);
}

export async function POST(request) {
    const inventory = await getInventory();
    const newItem = await request.json();

    // Assign new ID
    const newId = inventory.length > 0 ? Math.max(...inventory.map(i => i.id)) + 1 : 1;
    const itemWithId = { ...newItem, id: newId };

    inventory.push(itemWithId);
    await saveInventory(inventory);

    return NextResponse.json(itemWithId);
}

export async function PUT(request) {
    const inventory = await getInventory();
    const updatedItem = await request.json();

    const index = inventory.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
        inventory[index] = { ...inventory[index], ...updatedItem };
        await saveInventory(inventory);
        return NextResponse.json(inventory[index]);
    }

    return NextResponse.json({ error: "Item not found" }, { status: 404 });
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id')); // Fixed: 'id' was implicit, now accessing searchParams

    const inventory = await getInventory();
    const filteredInventory = inventory.filter(i => i.id !== id);

    if (inventory.length !== filteredInventory.length) {
        await saveInventory(filteredInventory);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Item not found" }, { status: 404 });
}
