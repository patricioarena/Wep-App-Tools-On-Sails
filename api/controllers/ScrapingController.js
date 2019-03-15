/**
 * ScrapingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

function remove(array, element) {
    return array.filter(e => e !== element);
}

const escapeRegExp = (string) => {
    return string.replace(/\n/g, ' ');
}

module.exports = {

    UnajContacts: async function (req, res){
        var puppeteer = require('puppeteer');
        const collection = [] ;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        var URL = 'https://www.unaj.edu.ar/contacto/';
        await page.goto(URL);
        
        let table = await page.evaluate(() => {
    
            const Sedes = [
                ...document.querySelectorAll('.wpb_wrapper')
            ].map((nodoSede) => nodoSede.innerText);
    
            return Sedes.map((sede, i) => ({ Sede: sede }))
        });
    
        await browser.close();
        
        for (let index = 0; index < table.length; index += 2) {
            let element = table[index];
            table = remove(table, element);
        }
    
        for (let index = 0; index < table.length; index += 2) {
            let element = table[index];
            let regExp = escapeRegExp(element.Sede);
            if (regExp !== '') {
                collection.push({property: regExp});
            }
        }
        res.status(200).send(collection);
    }


};

