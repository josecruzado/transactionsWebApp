'use client';

import { formatCurrency } from '@/app/lib/formatters';
import styles from './SummaryCards.module.css';

export default function SummaryCards({ summary }) {
  const { totalIncome, totalExpense, percentageSpent } = summary;
  const balance = totalIncome - totalExpense;

  return (
    <div className={styles.summaryContainer}>
      <div className={`${styles.summaryCard} ${styles.income}`}>
        <h3>Ingresos</h3>
        <p>{formatCurrency(totalIncome)}</p>
      </div>
      <div className={`${styles.summaryCard} ${styles.expense}`}>
        <h3>Gastos</h3>
        <p>{formatCurrency(totalExpense)}</p>
      </div>
      <div className={`${styles.summaryCard} ${styles.balance}`}>
        <h3>Balance</h3>
        <p>{formatCurrency(balance)}</p>
      </div>
      <div className={`${styles.summaryCard} ${styles.percentage}`}>
        <h3>% Gastado</h3>
        <p>{percentageSpent.toFixed(2)}%</p>
      </div>
    </div>
  );
}