import { Link } from "react-router-dom";
import "./EmployeeTable.css";


const EmployeeTable = ({ employees, onDelete, filterPosition, setFilterPosition, filterLevel, setFilterLevel, handleSortByFirstName, handleSortByLastName, handleSortByMiddleName, handleSortByLevel, handleSortByPosition, handleNameClick, addEmployee }) => (

  

  <div className="EmployeeTable">
    <label>Filter by level </label>
    <input onChange={(e) => {setFilterLevel(e.target.value)}}></input>
   
    <label>Filter by position </label>
    <input onChange={(e) => {setFilterPosition(e.target.value)}}></input>

    <button onClick={() => {handleSortByFirstName()}}>Sort by First Name</button>
    <button onClick={() => {handleSortByLastName()}}>Sort by Last Name</button>
    <button onClick={() => {handleSortByMiddleName()}}>Sort by Middle Name</button>
    <button onClick={() => {handleSortByLevel()}}>Sort by Level</button>
    <button onClick={() => {handleSortByPosition()}}>Sort by Position</button>
   
    
    
    <table>
      <thead>
        <tr>
          <th onClick={handleNameClick}>Name</th>
          <th>Level</th>
          <th>Position</th>
          <th>Present</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {employees.filter((employee) => {if (filterLevel === "") {return true} else {return employee.level.toLowerCase().includes(filterLevel.toLowerCase())}}).filter((employee) => {if (filterPosition === "") { return true } else { return employee.position.toLowerCase().includes(filterPosition.toLowerCase())}}).map((employee) => (
          <tr key={employee._id}>
            <td>{employee.name}</td>
            <td>{employee.level}</td>
            <td>{employee.position}</td>
            <td><input type="checkbox" onChange={() => addEmployee(employee)}></input></td>
            <td>
              <Link to={`/update/${employee._id}`}>
                <button type="button">Update</button>
              </Link>
              <button type="button" onClick={() => onDelete(employee._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EmployeeTable;
