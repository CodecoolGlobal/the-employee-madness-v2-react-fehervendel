import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";
import { Link } from "react-router-dom";
import Pagination from "../Components/Pagination/Pagination";

const fetchEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
};

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [filterPosition, setFilterPosition] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const levels = ["Godlike", "Expert", "Senior", "Medior", "Junior"];
  const positions = ["Superhero", "Director", "Main Actor", "Love Interests", "Antagonist", "Protagonist", "Operatour", "Comic Relief", "Joker"];
  const [search, setSearch] = useState("");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;

  const currentPosts = employees && employees.slice(firstPostIndex, lastPostIndex);

  function handleSortByLevel() {
    const sortedEmployees = [...employees].sort((a, b) => {
      const aIndex = levels.indexOf(a.level);
      const bIndex = levels.indexOf(b.level);

      return aIndex - bIndex;
    });
    setEmployees(sortedEmployees);
  }
  
  function handleSortByPosition() {
    const sortedEmployees = [...employees].sort((a, b) => {
      const aIndex = positions.indexOf(a.position);
      const bIndex = positions.indexOf(b.position);

      return aIndex - bIndex;
    });
    setEmployees(sortedEmployees);
  }

  const handleDelete = (id) => {
    deleteEmployee(id);

    setEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  useEffect(() => {
    fetchEmployees()
      .then((employees) => {
        setLoading(false);
        setEmployees(employees);
      })
  }, []);

  function handleSortByFirstName() {
   
    const sortedEmployees = employees.slice().sort((a, b) => {
      const nameA = a.name.match(/^(\S+)/)[1];
      const nameB = b.name.match(/^(\S+)/)[1];
  
      return nameA.localeCompare(nameB);
    });
    setEmployees(sortedEmployees);
  }

  function handleSortByLastName() {
    
    const sortedEmployees = employees.slice().sort((a, b) => {
      const nameA = a.name.match(/\b(\S+)$/)[1];
      const nameB = b.name.match(/\b(\S+)$/)[1];
  
      return nameA.localeCompare(nameB);
    });
    
    setEmployees(sortedEmployees);
  }

  function handleSortByMiddleName() {
    
    const sortedEmployees = employees.slice().sort((a, b) => {
      const nameA = a.name.match(/\b(\S+)\b\s+(\S+\s+)?(\S+)$/);
      const nameB = b.name.match(/\b(\S+)\b\s+(\S+\s+)?(\S+)$/);
  
      const middleA = nameA[2] ? nameA[2].trim() : '';
      const middleB = nameB[2] ? nameB[2].trim() : '';
  
      return middleA.localeCompare(middleB);
    });
    setEmployees(sortedEmployees);
  }

  function handleNameClick() {

    const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name));

    if(ascending) {
      setEmployees(sortedEmployees)
      setAscending(false);
    } else {
      setEmployees(sortedEmployees.reverse());
      setAscending(true);
    }
    
    
  }

  if (loading) {
    return <Loading />;
  }

  return (<div>
  <div><input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)}></input><Link to={`/employees/${search}`}><button>Search Employees</button></Link></div>
  <EmployeeTable
  employees={currentPosts}
  onDelete={handleDelete}
  filterPosition={filterPosition}
  setFilterPosition={setFilterPosition}
  filterLevel={filterLevel}
  setFilterLevel={setFilterLevel}
  handleSortByFirstName={handleSortByFirstName}
  handleSortByLastName={handleSortByLastName}
  handleSortByMiddleName={handleSortByMiddleName}
  handleSortByLevel={handleSortByLevel}
  handleSortByPosition={handleSortByPosition}
  handleNameClick={handleNameClick}
  />;
  <Pagination
  totalPosts={employees.length}
  postsPerPage={postsPerPage}
  setCurrentPage={setCurrentPage}
  currentPage={currentPage}
  />
  </div>)
};

export default EmployeeList;
