## APLICACION PARA CONSULTAR PERSONAJES DE RICK & MORTY

CONFIGURACION:
- INSTALAR NODE
- CORRER NPM INSTALL PARA DESCARGAR LAS DEPENDENCIAS
- CORRER NPM START PARA INICIAR EL SERVIDOR (APLICACION CORRIENDO EN EL PUERTO 7001)
- Deployado en: https://rick-and-morty-review.herokuapp.com/

INSTRUCCIONES: 

Al sitio web solo se puede acceder con los username que retorna la siguiente API: https://jsonplaceholder.typicode.com/users

Este Endpoint le retornara una lista de usuarios que son los que poseen acceso al sistema.

Su formulario de login debe validar si el usuario y clave ingresada existe en la respuesta de la API , ósea que si una persona desea acceder al sistema solo podrá realizarlo con la credenciales que le retorna la API.

La siguiente lista posee todas las credenciales autorizadas a acceder al sitio (Username/pass):

    1.- Sincere@april.biz	            1
    2.- Shanna@melissa.tv	            2
    3.- Nathan@yesenia.net	            3
    4.- Julianne.OConner@kory.org	    4
    5.- Lucio_Hettinger@annie.ca	    5
    6.- Karley_Dach@jasper.info	        6
    7.- Telly.Hoeger@billy.biz	        7
    8.- Sherwood@rosamond.me	        8
    9.- Chaim_McDermott@dana.io	        9
    10.- Rey.Padberg@karina.biz	        10

La contraseña ingresada se valida en el endpoint de login; La contraseña debe ser numerica y de maximo 2 caracteres; con 3 intentos fallidos se bloquea el usuario.

Despues de iniciar sesion se puede ingresar a la pantalla de consulta de personajes; esta pantalla utiliza la api “https://rickandmortyapi.com/”.

En la pantalla de consulta se debe ingresar el ID de personaje, y con esto se pueden consultar los datos y la imagen del personaje haciendo click sobre el campo "Name".