'use client';

import { formatCurrency, formatDate } from '@/app/lib/formatters';
import styles from './TransactionList.module.css';

export default function TransactionList({
    transactions,
    filter,
    onFilterChange,
    onEdit,
    onDelete,
    isLoading
}) {
    const handleEditClick = (transaction) => {
        onEdit(transaction);
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            return;
        }

        await onDelete(id);
    };

    return (
        <div className={styles.transactions}>
            <div className={styles.transactionsHeader}>
                <h2>Transacciones</h2>
                <div className={styles.filterControls}>
                    <select
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value)}
                    >
                        <option value="all">Todos</option>
                        <option value="income">Ingresos</option>
                        <option value="expense">Gastos</option>
                    </select>
                </div>
            </div>

            <div className={styles.transactionsList}>
                {isLoading ? (
                    <div className="empty-message">Cargando transacciones...</div>
                ) : transactions.length === 0 ? (
                    <div className="empty-message">No hay transacciones para mostrar</div>
                ) : (
                    transactions.map((transaction) => {
                        const isIncome = transaction.type === 'income';

                        return (
                            <div key={transaction._id} className={styles.transactionItem}>
                                <div className={styles.transactionInfo}>
                                    <div className={styles.transactionName}>{transaction.name}</div>
                                    <div className={styles.transactionCategory}>
                                        {transaction.category} • {formatDate(transaction.date)}
                                    </div>
                                </div>
                                <div className={`${styles.transactionAmount} ${isIncome ? styles.incomeAmount : styles.expenseAmount}`}>
                                    {isIncome ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                                </div>
                                <div className={styles.transactionActions}>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => handleEditClick(transaction)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteClick(transaction._id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}