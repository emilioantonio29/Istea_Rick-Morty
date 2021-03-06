////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import express from 'express';
import { routerRender } from './routerRender.js';
const app = express(); 
import handlebars from "express-handlebars"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use('/', routerRender())
app.use(express.static('public'));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MIDDLEWARE TERCEROS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MOTOR DE PLANTILLAS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.engine("hbs",
    handlebars({
        extname: "hbs",
        defaultLayout: "layout.hbs", //opcional: en caso de no estar configurado llama al main.hbs
    })
);

app.set('views', './public'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 7001
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puert ${server.address().port}`)
})
server.on('error',(error) => {console.log(`error: ${error.message}`)})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// para GLITCH:
// server.listen(process.env.PORT, function() {
//     console.log('Servidor corriendo en http://localhost:'+process.env.PORT);
// })