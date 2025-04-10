import React from 'react';
import InventoryTable from './components/InventoryTable';
import AddItemForm from './components/AddItemForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Warehouse Inventory Manager</h1>
      <AddItemForm />
      <InventoryTable />
    </div>
  );
}

export default App;