import './style.css';
import { Scanner, stopScanner } from './Scanner.js'; 


let products = JSON.parse(localStorage.getItem("productList")) || [];

function start(){

    console.log(JSON.parse(localStorage.getItem("productList")))

    console.log(products[1].image)

    document.getElementById("image").src = products[1].image;
     
    let barcode = "";

    const button = document.getElementById("startScan");
    button.addEventListener("click", async ()=> {
        try{
            barcode = await Scanner();
            console.log(barcode);
            stopScanner();        
            getData(barcode).then(product=> {
                console.log(product);
                const newProduct = {name: product.product_name, nutrients: product.nutriments, image: product.image_url};
                products.push(newProduct)
                localStorage.setItem("productList", JSON.stringify(products));
                console.log(JSON.parse(localStorage.getItem("productList")));
                // const { product_name, nutriments, serving_size } = product;
                // const { "added-sugars_serving": addedSugars, carbohydrates_serving: carbs, 
                //         "energy-kcal_serving": calories, fat_serving: fats, 
                //         proteins_serving: protein, "trans-fat_serving": fat } = nutriments;
            });
            
        }
        catch(error)
        {
            console.error(error);
        }
    })
}

function getData(code){
    const url = `https://world.openfoodfacts.org/api/v0/product/${code}.json`;
    return fetch(url).then(response => response.json())
                     .then(data => {
                        return data.product;
                     })
                     .catch(error => console.error(error));
}

start();

