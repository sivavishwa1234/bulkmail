import React, { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [fruits, setFruits] = useState([]);

  // Fetch fruits on load
  useEffect(() => {
    fetch("http://localhost:5000/fruits")
      .then(res => res.json())
      .then(data => setFruits(data))
      .catch(() => {
        // Optionally handle error
      });
  }, []);

  const addFruit = () => {
    if (!name.trim() || !cost.trim()) return;

    if (fruits.some(f => f.name === name.trim())) {
      alert("Fruit already exists");
      return;
    }

    fetch("http://localhost:5000/fruits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), cost: Number(cost) }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          setFruits([...fruits, data.fruit]);
          setName("");
          setCost("");
        }
      })
      .catch(() => alert("Failed to add fruit"));
  };

  return (
    <div>
      <input 
        placeholder="Fruit name" 
        value={name} 
        onChange={e => setName(e.target.value)} 
      />
      <input 
        placeholder="Cost" 
        type="number" 
        value={cost} 
        onChange={e => setCost(e.target.value)} 
      />
      <button onClick={addFruit}>Add</button>

      {fruits.map(fruit => (
        <h1 key={fruit._id}>{fruit.name} - ${fruit.cost}</h1>
      ))}
    </div>
  );
}

export default App;
