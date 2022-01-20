import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import FS from 'session-file-store';
import mongoose from 'mongoose';
import passport from 'passport';
import passportLocalPkg from 'passport-local';
import fetch from 'node-fetch';
const { Strategy: LocalStrategy } = passportLocalPkg;
const SchemaLocal = mongoose.Schema
const userSchema = new SchemaLocal({
    username: {type: String},
    password: {type: String}
})
const UsuariosDAOLocal = mongoose.model('users', userSchema)

// funcion para crear el router, cargar el middleware para convertir la tira de string del request a json, carga las rutas y vincula al manejador con el array de mascotass
function routerRender(){

    //const MongoStore = MS(session)
    //const FileStore = FS(session)
    const routerApi = express.Router()
    routerApi.use(express.json())
    routerApi.use(express.urlencoded({extended: true}))
    routerApi.use(cookieParser())
    routerApi.use(session({
        //store: new FileStore({path:'./sesiones',ttl:300,retries:0}),
        secret: 'dontUseVar',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 300000 }
      }))
    routerApi.use(passport.initialize());
    routerApi.use(passport.session());
 
    var auth = function(req, res, next){
        if(req.session.nombre){
            //console.log("next");
            return next();
        }else{
            //console.log("noNext");
            return res.render("login", {
                bienvenida: "Para ver el contenido, por favor inicia sesión",
                sesionIniciada: false
            });
        }
    }
    const expire = 300000
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // RAIZ API
    function validacionClave(id) {
        var expresionRegular = /^\d{1,2}$/;
        if (!expresionRegular.test(id)) {
        //retorno falso si la clave es invalida
        return false;
        }
        //retorno verdadero si la clave es valida
        return true;
        }

    let usersAttempsWrongPassword = []
    var users = [];

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fetch(`https://jsonplaceholder.typicode.com/users`)
        .then(response => response.json())
        .then(json => {
            for(let i =0;i<json.length;i++){
                let username = json[i].email
                let pass = json[i].id
                let name = json[i].name
                users.push({"username": username, "pass": pass, "name": name})
            }
            console.log(users)
        })


    routerApi.post("/log", (req, res)=>{
        const data = req.body;
        //console.log(`data: ${data}`)
        let idPass = data.password
        //console.log(req.sessionID)
        //console.log(req)

        /*----------------------------------------------------------------------------------------------------------
        |   For: Busco si en un array declarado de users, tengo alguno igual al ingresado por el usuario
        ----------------------------------------------------------------------------------------------------------*/
        let user;
        for(let i = 0;i<users.length;i++){
            if(users[i].username === data.username){
                user = users[i]
            }
        }
        /*----------------------------------------------------------------------------------------------------------
        |   For: Busco si en un array declarado de intentos fallidos, tengo alguno igual al ingresado por el usuario
        ----------------------------------------------------------------------------------------------------------*/
        let attemp;
        for(let i = 0;i<usersAttempsWrongPassword.length;i++){
            if(usersAttempsWrongPassword[i].username === data.username){
                attemp = usersAttempsWrongPassword[i]
            }
        }
        /*----------------------------------------------------------------------------------------------------------
        |   Validacion 1: Si el usuario tiene mas de dos intentos fallidos, lo mando a la vista de usuario bloqueado
        ----------------------------------------------------------------------------------------------------------*/
        //console.log("intento: "+attemp)
        if(attemp !== undefined){
            console.log("usuario bloquado por intentos fallidos")

            if(attemp.Attempts>2){
                return res.render("block", {

                });
            }

        }
        /*----------------------------------------------------------------------------------------------------------
        |   BLOQUE: Reglas de negocio
        ----------------------------------------------------------------------------------------------------------*/
        //console.log(data)
        if(user !== undefined && user.pass == data.password){
            /*----------------------------------------------------------------------------------------------------------
            |   1: Si ingresa bien la contraseña y el user, lo autentico. Le borro la cantidad de intentos fallidos
            ----------------------------------------------------------------------------------------------------------*/
            req.session.cookie.maxAge = expire
            const nombre = data.user
            //req.session.nombre = data.username
            req.session.nombre = user.name
            //console.log(req.session.nombre)
            //res.json({login: `Bienvenid@ ${req.session.nombre}`,sesionIniciada: true})
            console.log("usuario autenticado: "+user.name)
            for(let i = 0;i<usersAttempsWrongPassword.length;i++){
                if(usersAttempsWrongPassword[i].username === data.username){
                    usersAttempsWrongPassword.splice(i,1)
                }
            }
            res.render("index", {
                bienvenida: "¡Bienvenid@s al proyecto!",
                login: `Bienvenid@ ${req.session.nombre}`,
                sesionIniciada: true
            });
        }else if(user === undefined){
            /*----------------------------------------------------------------------------------------------------------
            |   2: Si ingresa un email que no existe en la base de usuarios, le informo con un mensaje
            ----------------------------------------------------------------------------------------------------------*/
            console.log("usuario ingresado: "+data.username +" no existe.")
            res.render("login", {
                sesionIncorrecta: `El usuario no existe.`,
                sesionIniciada: false
            })
        }else if(!(validacionClave(parseInt(idPass)))){
            /*----------------------------------------------------------------------------------------------------------
            |   3: Si ingresa un formato de contraseña incorrecto (numero mayor a dos digitos o string) le informo con un mensaje
            ----------------------------------------------------------------------------------------------------------*/
            console.log("el formato de contraseña ingresado por el usuario es incorrecto")
            res.render("login", {
                sesionIncorrecta: `Formato de contraseña incorrecto. La contraseña debe ser numerica y de maximo 2 caracteres.`,
                sesionIniciada: false
            })
        }
        else{
            /*----------------------------------------------------------------------------------------------------------
            |   4: Creación y evaluacion de intentos fallidos
            ----------------------------------------------------------------------------------------------------------*/
            if(attemp === undefined){
                //console.log("ok")
                console.log("Contraseña incorrecta. Cantidad de intentos fallidos: 1")
                usersAttempsWrongPassword.push({"username": data.username, "Attempts": 1})
                res.render("login", {
                    // sesionIncorrecta: `Contraseña o Pass Incorrectas. Intentalo nuevamente...`,
                    sesionIncorrecta: `Contraseña incorrecta. Cantidad de intentos fallidos: 1`,
    
                    sesionIniciada: false
                })
            }else{
                switch(attemp.Attempts) {
                    case 1:
                        console.log("Contraseña incorrecta. Cantidad de intentos fallidos: 2")
                        for(let i = 0;i<usersAttempsWrongPassword.length;i++){
                            if(usersAttempsWrongPassword[i].username === attemp.username){
                                usersAttempsWrongPassword[i].Attempts = 2
                            }
                        }
                        // let intentoIncorrecto = attemp.Attempts-1
                        res.render("login", {
                            // sesionIncorrecta: `Contraseña o Pass Incorrectas. Intentalo nuevamente...`,
                            sesionIncorrecta: `Contraseña incorrecta. Cantidad de intentos fallidos: 2 (al tercer intento fallido se bloquea el usuario)`,
            
                            sesionIniciada: false
                        })
                      break;
                    case 2:
                        for(let i = 0;i<usersAttempsWrongPassword.length;i++){
                            if(usersAttempsWrongPassword[i].username === attemp.username){
                                usersAttempsWrongPassword[i].Attempts = 3
                            }
                        }
                        res.render("block", {

                        });

                      break;
                    case 3:
                        res.render("block", {

                        });

                      break;
                    default:
                  } 
            }
        }
    })

    routerApi.get('/', auth, (req, res) =>{
        req.session.cookie.maxAge = expire
        res.render("index", {
            bienvenida: "¡Bienvenid@s al proyecto!",
            login: `Bienvenid@ ${req.session.nombre}`,
            sesionIniciada: true
        });
    })

    routerApi.get('/login', (req, res) =>{
        if(req.session.nombre){
            res.render("login", {
                bienvenida: `Bienvenid@ ${req.session.nombre}, Ya iniciaste Sesión`,
                login: `Bienvenid@ ${req.session.nombre}`,
                sesionIniciada: true
            });
        }else{
            res.render("login", {
                bienvenida: "¡Bienvenid@: Por favor inicia sesión!",
                login: `Bienvenid@ - Por favor inicia sesión!`,
                sesionIniciada: false
            });
        }
    })


    //GET DATA
    routerApi.get("/personajes", auth, (req, res)=>{
        req.session.cookie.maxAge = expire
        res.render("personajes", {
            bienvenida: "¡Bienvenid@s al proyecto!",
            login: `Bienvenid@ ${req.session.nombre}`,
            sesionIniciada: true
        });
    })

    routerApi.get('/logout', (req, res) => {
        if(!req.session.nombre){
            res.render("logout", {
                hastaluego: `Hola, aun no has iniciado sesión`,
                sesionIniciada: false
            });
        }else{
            let name =  req.session.nombre
            req.session.destroy(err => {
                if (err) {
                  res.json({ error: 'logout', body: err })
                } else {
                  res.render("logout", {
                      hastaluego: `Hasta Luego ${name}`,
                      sesionIniciada: false
                  });
                }
              })
        }
    })

    return routerApi;

}
export {routerRender}