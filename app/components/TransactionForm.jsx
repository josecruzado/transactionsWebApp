'use client';

import { useState, useEffect } from 'react';
import styles from './TransactionForm.module.css';

export default function TransactionForm({ 
  onSubmit, 
  transactionToEdit, 
  onCancelEdit 
}) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    type: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        name: transactionToEdit.name,
        amount: transactionToEdit.amount,
        category: transactionToEdit.category,
        type: transactionToEdit.type
      });
      setIsEditing(true);
    } else {
      resetForm();
    }
  }, [transactionToEdit]);

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      category: '',
      type: ''
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleRadioChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      type: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    }, isEditing ? transactionToEdit._id : null);
    
    if (success) {
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className={styles.transactionForm}>
      <h2>{isEditing ? 'Editar Transacción' : 'Nueva Transacción'}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Descripción</label>
          <input 
            type="text" 
            id="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="amount">Monto</label>
          <input 
            type="number" 
            id="amount" 
            step="0.01" 
            value={formData.amount} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category">Categoría</label>
          <select 
            id="category" 
            value={formData.category} 
            onChange={handleChange} 
            required
          >
            <option value="">Seleccionar categoría</option>
            <option value="Salario">Salario</option>
            <option value="Inversiones">Inversiones</option>
            <option value="Comida">Comida</option>
            <option value="Transporte">Transporte</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Servicios">Servicios</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Tipo</label>
          <div className={styles.radioGroup}>
            <label>
              <input 
                type="radio" 
                name="type" 
                value="income" 
                checked={formData.type === 'income'} 
                onChange={handleRadioChange} 
                required 
              /> Ingreso
            </label>
            <label>
              <input 
                type="radio" 
                name="type" 
                value="expense" 
                checked={formData.type === 'expense'} 
                onChange={handleRadioChange} 
              /> Gasto
            </label>
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit">
            {isEditing ? 'Actualizar' : 'Guardar'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              className="cancel-btn btn" 
              onClick={handleCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}