const fs = require('fs');
const assert = require('chai').assert;

const loggingService = require('./LoggingService');

describe("loggingService tests",() => {

    let servicioDeLoggin;

    beforeEach(() => {
        servicioDeLoggin = new loggingService();        
    })

    afterEach(() => {
        fs.unlinkSync('logs.txt');
    })

    it("loggingService puede crear un archivo para generar logs",()=>{

        assert.isFalse(fs.existsSync('./logs.txt'));

        return servicioDeLoggin.loggearSucesoLocalmente('Un log').then((res) => {

            assert.isTrue(fs.existsSync('./logs.txt'));
            assert.isTrue(fs.readFileSync('./logs.txt').includes('Un log'));
        })
    })

    it("en caso de que el archivo ya este creado, loggingService sigue escribiendolo, no crea otro", () => {

        assert.isFalse(fs.existsSync('./logs.txt'));

        return servicioDeLoggin.loggearSucesoLocalmente('Un log').then((res) => {

            assert.isTrue(fs.existsSync('./logs.txt'));
            assert.isTrue(fs.readFileSync('./logs.txt').includes('Un log'));

           return servicioDeLoggin.loggearSucesoLocalmente(' Un log').then((re) => {   
                assert.isTrue(fs.existsSync('./logs.txt'));
                assert.isTrue(fs.readFileSync('./logs.txt').includes('Un log'));
           });
        })
    })
})