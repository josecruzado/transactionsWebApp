'use client';

import { useState, useEffect, useCallback } from 'react';

const API_URL = "https://u5bitrv2t0.execute-api.us-east-1.amazonaws.com";

export function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        percentageSpent: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar transacciones
    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/transactions`);
            if (!response.ok) throw new Error("Error al cargar las transacciones");

            const data = await response.json();
            setTransactions(data);
            applyFilter(data, filter);
        } catch (error) {
            setError("No se pudieron cargar las transacciones. Verifica la conexión al servidor.");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    // Cargar resumen
    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary`);
            if (!response.ok) throw new Error("Error al cargar el resumen");

            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error("Error al cargar el resumen:", error);
        }
    }, []);

    // Aplicar filtro a las transacciones
    const applyFilter = useCallback((transactionsData, currentFilter) => {
        if (currentFilter === 'all') {
            setFilteredTransactions(transactionsData);
        } else {
            setFilteredTransactions(transactionsData.filter(t => t.type === currentFilter));
        }
    }, []);

    // Cambiar filtro
    const changeFilter = useCallback((newFilter) => {
        setFilter(newFilter);
        applyFilter(transactions, newFilter);
    }, [transactions, applyFilter]);

    // Crear transacción
    const createTransaction = async (transactionData) => {
        try {
            const response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al crear la transacción");
            }

            await fetchTransactions();
            await fetchSummary();
            return true;
        } catch (error) {
            setError(error.message);
            console.error("Error:", error);
            return false;
        }
    };

    // Actualizar transacción
    const updateTransaction = async (id, transactionData) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar la transacción");
            }

            await fetchTransactions();
            await fetchSummary();
            return true;
        } catch (error) {
            setError(error.message);
            console.error("Error:", error);
            return false;
        }
    };

    // Eliminar transacción
    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la transacción");
            }

            await fetchTransactions();
            await fetchSummary();
            return true;
        } catch (error) {
            setError(error.message);
            console.error("Error:", error);
            return false;
        }
    };

    // Obtener transacción por ID
    const getTransactionById = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`);
            if (!response.ok) throw new Error("Error al obtener la transacción");

            return await response.json();
        } catch (error) {
            setError(error.message);
            console.error("Error:", error);
            return null;
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchTransactions();
        fetchSummary();
    }, [fetchTransactions, fetchSummary]);

    // Cuando cambia el filtro, aplicarlo a las transacciones existentes
    useEffect(() => {
        applyFilter(transactions, filter);
    }, [transactions, filter, applyFilter]);

    return {
        transactions: filteredTransactions,
        summary,
        filter,
        isLoading,
        error,
        changeFilter,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById
    };
}