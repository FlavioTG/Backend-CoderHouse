import express from "express";
//import { productos } from "../utils.js";


export const routerProductos = express.Router();

routerProducts.get('/listProducts', async (req, res) => {
  const productsList = await products.getAll()
  res.json(productsList)
})


// devuelve un producto según su id
routerProducts.get('/:id', async (req, res) =>{
  const productById = await products.getById(parseInt(req.params.id))
  productById === null ? res.json({ Error:  'Producto no encontrado' }) : res.json(productById)
})
// recibe y agrega un producto, y lo devuelve con su id asignado
routerProducts.post('/addProduct', async (req, res) =>{
  const savedProduct = await products.save(req.body)
  res.json(savedProduct)
})

// recibe y actualiza un producto según su id
routerProducts.put('/:id', async (req, res) =>{
  const updateInfo = req.body
  const productsList = await products.getAll()
  regToUpdate = productsList.findIndex(product => product.id === parseInt(req.params.id))
  if (regToUpdate === -1) {
      return res.send({ Error:  'Producto no encontrado' })
  }
  productsList[regToUpdate] = { ...updateInfo, id: parseInt(req.params.id) }
  await products.saveData(productsList)
  res.json({ ...updateInfo, id: parseInt(req.params.id) })
})

// elimina un producto según su id
routerProducts.delete('/:id', async (req, res) =>{
  // almaceno el resultado de buscar el id para mostrar éxito o fallo al buscar ID para eliminar
  const deletedId = await products.getById(parseInt(req.params.id))
  await products.deleteById(parseInt(req.params.id))
  deletedId === null
      ? res.json( {'Producto con ID': `${parseInt(req.params.id)} no encontrado`} )
      : res.json( {'Producto eliminado': deletedId} )
})
