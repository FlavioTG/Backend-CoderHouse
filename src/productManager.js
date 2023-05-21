const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.path = path;

        if (!fs.existsSync(this.path)) {
            // Si el archivo no existe, crear un archivo vacío en la ruta especificada
            fs.writeFileSync(this.path, '[]');
        }
    }
    #generarId(products) {
        let maxId = 0;
        for (let i = 0; i < products.length; i++) {
            const cont = products[i];
            if (cont.id > maxId) {
                maxId = cont.id;
            }
        }
        return ++maxId;
    }
    getProducts = async () => {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            const content = JSON.parse(products);
            //console.log(content)
            return content;
        } catch (err) {
            console.log(err);
        }
    };
    /*async getProducts()
    {
        const products = await fs.promises.readFile(this.path, 'utf-8');
        if (products.length == 0)
            return null
        else
        {    
            return JSON.parse(products);
        }    
    }*/
    #getProductsHide = async () => {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            const content = JSON.parse(products);
            return content;
        } catch (err) {
            console.log(err);
        }
    };
    /*async #getProductsHide() {
        const products = await fs.promises.readFile(this.path, 'utf-8');
        if (products.length == 0)
            return null
        else
        {    
            return JSON.parse(products);
        }
        
    }*/
    getProductById = async (id) => {
        try {
            const productsSearch = await this.#getProductsHide();
            if (!productsSearch.find((product) => product.id == id)) {
                var status = {
                    error: '123',
                    messaje: 'El producto no fue encontrado'
                };
                return status
            }
            return productsSearch.find((product) => product.id == id);
        }catch (err){
            console.log(err);
        }

    }
    /*async getProductById(id) ={
        const productsSearch = await this.#getProductsHide();
        if (!productsSearch.find((product) => product.id == id))
        {
            return "No se encontro el producto"
        }
        return productsSearch.find((product) => product.id == id);
    }*/

    getProductByCode = async (code) => {
        try {
            const productsSearch = await this.#getProductsHide();
            if (!productsSearch.find((product) => product.code == code)) {
                return "No se encontro el producto"
            }
            return productsSearch.find((product) => product.code == code);
        }catch (err){
            console.log(err);
        }

    }
    /*async getProductByCode(code) {
        let productsSearch = await this.#getProductsHide();
        return productsSearch.find((product) => product.code == code);
    }*/

    updateFile = async (products) => {
        try {
            const dataToUpload = JSON.stringify(products);
            await fs.promises.writeFile(this.path, dataToUpload);
        } catch (err) {
            console.log('error escritura en archivo!', err);
        }
    }
    /*async updateFile(products) {
        let dataToUpload = JSON.stringify(products);
        await fs.promises.writeFile(this.path, dataToUpload);
    }*/

    async addProduct(product) {   //title,stock,description,price,thumbnail,code,stock

        //Validaciones
        if (!product.title) {
            throw new Error("Titulo necesario");
        }
        if (!product.description) {
            throw new Error("Descri´ción necesaria")
        }
        if (!product.thumbnail) {
            throw new Error("Thumbnail necesario")
        }
        if (!product.code) {
            throw new Error("Codigo necesario")
        }
        if (!product.stock) {
            throw new Error("Cantidad necesaria")
        }
        if (!product.price) {
            throw new Error("Precio necesario")
        }

        let listProducts = await this.#getProductsHide();
        // Comprobar si el objeto está vacío
        if (listProducts == null) {
            // Si el objeto está vacío, agrego el nuevo elemento (no verifico si existe)        
            const newProducts = { ...product, id: 1 };
            let listProducts = [];
            listProducts.push(newProducts);
            // Escribir el archivo JSON
            await this.updateFile(listProducts);

            return newProducts;
        }
        else {
            const productExists = await this.getProductByCode(product.code);
            if (productExists) {
                throw new Error(`El producto con el código ${product.code} ya existe`);
            }
            else {
                const newProducts = { ...product, id: this.#generarId(listProducts) };
                listProducts.push(newProducts);
                await this.updateFile(listProducts);
                return newProducts;
            }
        }
    }


    async updateProduct(id, updates) {
        const products = await this.#getProductsHide();
        const index = products.findIndex((product) => product.id == id);
        if (index != -1) {//si encontramos el id buscado
            updates.id = id;

            Object.assign(products[index], updates);
            //products[index] = updates;
            await this.updateFile(products);
            return updates;
        }
        else {
            return "No había producto que actualizar";
        }
    }

    async deleteProduct(id) {
        const products = await this.#getProductsHide();
        const filteredProducts = products.filter((product) => product.id != id);
        if (products.length != filteredProducts.length) //si es distinto procedo a actualizar luego del filtro
        {
            await this.updateFile(filteredProducts);
            return "El producto fue correctamente eliminado";
        }
        else {
            return "No se pudo eliminar el producto";
        }
    }

}

/*const Producto = ({title: 'Camiseta celeste',
description: 'Camiseta de belgrano',
price: 200,
thumbnail: 'https://example.com/camiseta.jpg',
code: 5,
stock: 32
})

const pm = new ProductManager("products.json")
try{
    pm.addProduct(Producto)
}
catch(err){
    console.log(err)
}
*/
module.exports = ProductManager

