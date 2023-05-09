require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const EmployeeModel = require("./db/employee.model");
const EntityModel = require("./db/entity.model");
const brandsModel = require("./db/brands.model");

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());

app.get("/api/brand", async(req, res) => {
  try {
    //const brands = await brandsModel.find();
    const employee = await EmployeeModel.find().populate("favBrand")
    res.status(200).json(employee)
  } catch(err) {
    console.error(err)
    res.status(500).send({message: "Failed to fatch brands"})
  }
})

app.get("/api/brands", async (req, res) => {
  try {
    const brands = await brandsModel.find();
    res.status(200).json(brands);
  } catch(err) {
    console.error(err);
  }
})

app.get("/api/employee/:search", async (req, res) => {
  try {
    const employees = await EmployeeModel.find({ name: {$regex: req.params.search, $options: "i"}});
    return res.json(employees);
  } catch (err) {
    console.error(err);
  }
})

app.get("/api/entity", async (req, res) => {
  const entity = await EntityModel.find();
  return res.json(entity);
})

app.post("/api/entity", async (req, res) => {
  const name = req.body.name;
  const type = req.body.type;
  const amount = req.body.amount;

  const entity = new EntityModel({
    name,
    type,
    amount,
  })
  entity.save()
  .then(() => res.status(200).json("Successful save"))
  .catch((err) => res.status(500).json("Error while saving"));
});

app.patch("/api/entity/:id", async (req, res) => {
  try {
    const update = {};
    if (req.body.name !== "") {
      update.name = req.body.name;
    }
    if (req.body.type !== "") {
      update.type = req.body.type;
    }
    if (req.body.amount !== "") {
      update.amount = req.body.amount;
    }
    await EntityModel.findOneAndUpdate({_id: req.params.id}, update)
    res.status(200).json({ message: "Successful update!" })
  } catch (err) {
    res.status(500).json({ message: "Failed to update" })
  }
})

app.delete("/api/entity/:id", async (req, res) => {
  try {
    const entity = await EntityModel.findById(req.params.id);
    const deleted = await entity.delete();
    return res.json(deleted);
  } catch (err) {
    console.error(err)
  }
})

app.get("/api/employees/", async (req, res) => {
  const employees = await EmployeeModel.find().sort({ created: "desc" });
  return res.json(employees);
});

app.get("/api/employees/:id", async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  return res.json(employee);
});

app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    // const employee = await EmployeeModel.findOneAndUpdate(
    //   { _id: req.params.id },
    //   { $set: { ...req.body } },
    //   { new: true }
    // );
    let employee = await EmployeeModel.findOne( {_id: req.params.id} );
    employee.name = req.body.name
    employee.level = req.body.level
    employee.position = req.body.position
    employee.equipment = [...employee.equipment, req.body.equipment]
    employee.favBrand = req.body.favBrand
    employee.save();
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    const deleted = await employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log("App is listening on 8080");
    console.log("Try /api/employees route right now");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
