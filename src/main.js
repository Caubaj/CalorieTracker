import './style.css';
import { Scanner, stopScanner } from './Scanner.js'; 


function start(){

    let barcode = "";

    const button = document.getElementById("startScan");
    button.addEventListener("click", async ()=> {
        try{
            barcode = await Scanner();
            console.log(barcode);
            stopScanner();
           
            getData(barcode).then(product=> {

                const { product_name, nutriments, serving_size } = product;

                const { "added-sugars_serving": addedSugars, carbohydrates_serving: carbs, 
                        "energy-kcal_serving": calories, fat_serving: fats, 
                        proteins_serving: protein, 
                } = nutriments;

                console.log(product);

                console.log(product_name);
                console.log(nutriments);

                console.log(carbs);

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

