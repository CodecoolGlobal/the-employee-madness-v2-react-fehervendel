import React, { useEffect, useState } from "react";

function Equipment() {
    const [equipments, setEquipments] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [amount, setAmount] = useState("");
    const [update, setUpdate] = useState(-1);

    async function fetchEquipments() {
        try {
            const res = await fetch("/api/entity");
            const response = await res.json();
            setEquipments(response);
        } catch (err) {
            console.error(err)
        }
    }

useEffect(() => {
    fetchEquipments();
}, []);

    async function newEquipment(e) {
        e.preventDefault();
        const equipment = { name: name, type: type, amount: amount };
        try {
            const res = await fetch("/api/entity", {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify(equipment),
            });
            const response = await res.json();
        } catch (err) {
            console.error(err);
        }
        setName("");
        setType("");
        setAmount("");
        fetchEquipments();
    }

     function handleEdit(id) {
        setUpdate(id);
     }

    function handleRemove(id) {
        fetch(`/api/entity/${id}`, {
            method: "DELETE",
          })
            .then(response => {
              setEquipments(equipments.filter((x) => x._id !== id))
            })
            .catch(error => {
              console.error(error);
            });
    }

    
    function saveEdit(id, name, type, amount) {
        const data = { name, type, amount };
        fetch(`/api/entity/${id}`, {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(response => {
            fetchEquipments();
          })
          .catch(error => {
            console.error(error);
          });
          setUpdate(-1);
          
    }


function Edit({equipment}) {
        const [editName, setEditName] = useState(equipment.name);
        const [editType, setEditType] = useState(equipment.type);
        const [editAmount, setEditAmount] = useState(equipment.amount);

        return(
            <tr>
              <td><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}/></td>
              <td><input type="text"  value={editType} onChange={(e) => setEditType(e.target.value)}/></td>
              <td><input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)}/></td>
              <td><button type="submit" onClick={() => saveEdit(equipment._id, editName, editType, editAmount)}>Save</button></td>
              <td><button onClick={() => setUpdate(-1)}>Back</button></td>
            </tr>
          )
    }

    return(
<div>
    <table>
    <tr>
        <thead>
        <th>
                Add new equipment
        </th>
        </thead>
    <td>
            Name: 
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
        </td>
        <td>
            Type:
           <input type="text" value={type} onChange={(e) => setType(e.target.value)}></input> 
        </td>
        <td>
            Amount:
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}></input>
        </td>
        <button onClick={newEquipment}>Save</button>
        </tr>
        </table>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
            </tr>
         </thead>
         <tbody>
        {equipments && equipments.map((equipment) => 
        update === equipment._id ? <Edit equipment={equipment} /> :
            <tr>
            <td>{equipment.name}</td>
            <td>{equipment.type}</td>
            <td>{equipment.amount}</td>
            <td><button onClick={() => handleEdit(equipment._id)}>Edit</button></td>
            <td><button onClick={() => handleRemove(equipment._id)}>Delete</button></td>
            </tr>
        )}
       
        </tbody>
    </table>
</div>)
}

export default Equipment;