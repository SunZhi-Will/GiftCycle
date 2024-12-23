'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useClientId() {
    const [clientId, setClientId] = useState<string | null>(null);

    useEffect(() => {
        let id = localStorage.getItem('client_id');
        if (!id) {
            id = uuidv4();
            localStorage.setItem('client_id', id);
        }
        setClientId(id);
    }, []);

    return clientId;
} 