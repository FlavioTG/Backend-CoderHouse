const ProductManager = require('./src/productManager')
const express = require('express')

const app = express()
const PORT = 8000

app.listen(PORT, ()=>{
    console.log("Running on port", 8000)
})


app.get("/getProducts", async (req,res)=>{
    let limit = req.query.limit;
    if(!limit){
        try{
            const pm = new ProductManager('products.json');
            const products = await pm.getProducts();
            return res.send(JSON.stringify(products));
        }catch(err){
            console.log(err);
        }
    }
    else{
        limit = parseInt(limit)
        try{
            const pm = new ProductManager('products.json');
            const products = await  pm.getProducts();
            const products_limited = []
            for(let i = 0; i< products.length;i++){
                if (i< limit){
                    products_limited.push(products[i])
                }
            }
            return res.send(JSON.stringify(products_limited));
        }catch(err){
            console.log(err);
        }
    }
    console.log(limit)
})

app.get("/getProducts/:code", async (req,res)=>{
    const code = req.params.code

    try{
        const pm = new ProductManager('products.json');
        const products = await  pm.getProductByCode(code);
        return res.send(products)

    }catch(err){
        console.log(err);
    }
})
/*
    local:host:8000/
    localhost:8000/getproducts?limit=5
*/