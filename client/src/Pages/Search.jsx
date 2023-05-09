import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Search () {
    const [employees, setEmployees] = useState([]);
    const { search } = useParams();

    async function fetchSearch(name) {
        try {
            const res = await fetch(`/api/employee/${name}`);
            const response = await res.json();
            setEmployees(response);
        } catch (err) {
            console.error(err)
        }
    }


    useEffect(() => {
        fetchSearch(search);
    }, []);



    return <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Level</th>
                <th>Position</th>
            </tr>
        </thead>
        <tbody>
            {employees && employees.map((employee) => (
               <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.level}</td>
                <td>{employee.position}</td>
            </tr> 
            ))}
        </tbody>
    </table>
}

export default Search;