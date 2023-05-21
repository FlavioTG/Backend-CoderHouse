import express from "express";
import { routerProductos } from "./routes/productos.router.js";
import { __dirname } from "./utils.js";

const ProductManager = require('./productManager.js')
const express = require('express')

const app = express()
const PORT = 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use("/api/productos", routerProductos);

app.get("*", async (req, res) => {

    try {
        return res.status(404).json({
            status: "error",
            msg: "error esa ruta no existe",
            data: {},
        });
    } catch (err) {
        console.log(err);
    }

});

/*app.listen(PORT, () => {
    console.log("Running on port", 8000)
})*/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
