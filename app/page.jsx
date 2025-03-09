'use client';

import { useState } from 'react';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { useTransactions } from './hooks/useTransactions';
import styles from './page.module.css';

export default function Home() {
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const {
        transactions,
        summary,
        filter,
        isLoading,
        error,
        changeFilter,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById
    } = useTransactions();

    const handleFormSubmit = async (formData, transactionId) => {
        if (transactionId) {
            return await updateTransaction(transactionId, formData);
        } else {
            return await createTransaction(formData);
        }
    };

    const handleEditTransaction = async (transaction) => {
        setTransactionToEdit(transaction);
    };

    const handleCancelEdit = () => {
        setTransactionToEdit(null);
    };

    return (
        <main>
            <header>
                <h1>Finanzas Personales</h1>
                <SummaryCards summary={summary} />
                {error && <div className={styles.errorMessage}>{error}</div>}
            </header>

            <div className={styles.content}>
                <TransactionForm
                    onSubmit={handleFormSubmit}
                    transactionToEdit={transactionToEdit}
                    onCancelEdit={handleCancelEdit}
                />

                <TransactionList
                    transactions={transactions}
                    filter={filter}
                    onFilterChange={changeFilter}
                    onEdit={handleEditTransaction}
                    onDelete={deleteTransaction}
                    isLoading={isLoading}
                />
            </div>
        </main>
    );
}