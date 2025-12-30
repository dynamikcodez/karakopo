'use client';

import { CartProvider } from '../context/CartContext';
import FloatingCart from './FloatingCart';

export default function Providers({ children }) {
    return (
        <CartProvider>
            {children}
            <FloatingCart />
        </CartProvider>
    );
}
