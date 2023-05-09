import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

const updateEmployee = (employee) => {
  return fetch(`/api/employees/${employee._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  }).then((res) => res.json());
};

const fetchEmployee = (id) => {
  return fetch(`/api/employees/${id}`).then((res) => res.json());
};



const EmployeeUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState({});

  async function fetchBrands() {
    try {
      const res = await fetch("/api/brands");
      const response = await res.json();
      setBrands(response);
    } catch(error) {
      console.error(error);
    }
  }

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
    setEmployeeLoading(true);
    fetchEmployee(id)
      .then((employee) => {
        setEmployee(employee);
        setEmployeeLoading(false);
      });
      fetchBrands();
      fetchEquipments()
  }, [id]);

  const handleUpdateEmployee = (employee) => {
    setUpdateLoading(true);
    updateEmployee(employee)
      .then(() => {
        setUpdateLoading(false);
        navigate("/");
      });
  };

  if (employeeLoading) {
    return <Loading />;
  }

  return (
    <EmployeeForm
      employee={employee}
      onSave={handleUpdateEmployee}
      disabled={updateLoading}
      onCancel={() => navigate("/")}
      selectedEquipment={selectedEquipment}
      setSelectedEquipment={setSelectedEquipment}
      equipments={equipments}
      brands={brands}
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
    />
  );
};

export default EmployeeUpdater;
