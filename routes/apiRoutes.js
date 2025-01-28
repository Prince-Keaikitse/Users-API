const express = require("express");
const router = express.Router();
const sql = require("mssql");
const connectToDatabase = require("../db/dbConfig");

// POST route to execute a stored procedure (insert/update)
router.post("/addUser", async (req, res) => {
  const { 
    first_name,
    mid_name,
    last_name,
    user_role,
    last_update_by,
    transaction
   } = req.body;

  if (!user_role|| !transaction) {
    return res.status(400).send({ error: "User Role and Transaction are required!" });
  }

  try {
    const pool = await connectToDatabase();
    const request = pool.request();

    // Add parameters to the request
    request.input("first_name", sql.NVarChar(255), first_name);
    request.input("mid_name", sql.NVarChar(255), mid_name || null); // Allow nulls for optional params
    request.input("last_name", sql.NVarChar(255), last_name);
    request.input("user_role", sql.Int, user_role);
    request.input("last_update_by", sql.Int, last_update_by);
    request.input("transaction", sql.Char, transaction);


    const result = await request.execute("REGISTRATION.stp_InsertUpdateUsers");

    res.status(200).send({ 
        message: "User inserted/updated successfully.",
        user_id: result.recordset[0].User_id,
     });
  } catch (err) {
    console.error("Error executing procedure: ", err);
    res.status(500).send({ error: "Failed to insert/update user. " });
  }
});

// GET route to retrieve data
router.get("/getUser", async (req, res) => {
  const { first_name, user_id } = req.query;

if (!first_name && !user_id) {
    return res.status(400).send({error: "Please provide first name or user id."});
}

  try {
    const pool = await connectToDatabase();
    const request = pool.request();

    request.input("first_name", sql.NVarChar(255), first_name || null);
    request.input("user_id", sql.Int, user_id ? parseInt(user_id) : null);

    const result = await request.execute("REGISTRATION.stp_GetUsers");

    if (result.recordset.length > 0) {
        res.status(200).send(result.recordset);
    } else {
        res.status(404).send({message: "No users found."});
    }
  } catch (err) {
    console.error("Error executing procedure: ", err);
    res.status(500).send({ error: "Failed to retrieve user data." });
  }
});

module.exports = router;
