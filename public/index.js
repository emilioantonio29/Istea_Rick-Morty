/*----------------------------------------------------------------------------------------------*/ 
//                              Disparo la busqueda presionando ENTER
/*----------------------------------------------------------------------------------------------*/ 
var input = document.getElementById("idPersonaje");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("btnRender").click();
   //input = document.getElementById('idPersonaje').value = '';
  }
});


function renderPersonaje(){
    //console.log(input.value)
    fetch(`https://rickandmortyapi.com/api/character/${input.value}`)
        .then(res => res.json())
        .then(data => {
            //console.log(data)
            if(data.id){
                const template = Handlebars.compile(
                    `
                    <table class="container">
                    <thead>
                        <tr>
                            <th>
                                <h1>Id</h1>
                            </th>
                            <th>
                                <h1>Name</h1>
                            </th>
                            <th>
                                <h1>Status</h1>
                            </th>
                            <th>
                                <h1>Species</h1>
                            </th>
                            <th>
                                <h1>Type</h1>
                            </th>
                            <th>
                                <h1>Gender</h1>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${data.id}</td>
                            <td>
                            <button type="button" class="" data-toggle="modal" data-target="#myModal" id="fireModal" style="background: none;color: inherit;border: none;padding: 0;font: inherit;cursor: pointer;outline: inherit;">
                            ${data.name}
                            </button>
                            </td>
                            <td>${data.status}</td>
                            <td>${data.species}</td>
                            <td>${data.type}</td>
                            <td>${data.gender}</td>
                        </tr>
                    </tbody>
                    <!-- The Modal -->
                    <div class="modal" id="myModal">
                      <div class="modal-dialog">
                        <div class="modal-content">
                        
                          <!-- Modal Header -->
                          <div class="modal-header">
                            <h4 class="modal-title">${data.name}</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                          </div>
                            <img src=${data.image} alt=${data.name} > 
                          <!-- Modal body -->
                          
                          <!-- Modal footer -->
                          <div class="modal-footer">
                          </div>
                          
                        </div>
                      </div>
                    </div>
                    `
                    );
                    const html=template(
                        {
                            products: data
                        }
                    )
                    document.querySelector("#productos").innerHTML=html
            }else{
                const template = Handlebars.compile(
                    `
                    <br>
                    <div class="container"> 
                        <h1 style="color: blue;">No se encontraron personajes</h1>
                        <div class="d-flex justify-content-center align-items-center" style="height:50vh">
                            <img src="https://www.meme-arsenal.com/memes/be6e602d830c58c8341024616b0b6824.jpg" alt="">
                        </div>
                    </div>
                    `
                    );
                    const html=template(
                        {
                            products: data
                        }
                    )
                    document.querySelector("#productos").innerHTML=html
        
            }
        })
        .catch(err=>{
            console.log(err)
            compileError()
            const template = Handlebars.compile(
                `
                <br><br>
                <div class="container"> 
                    <h1 style="color: blue;">something's wrong: <a href="https://rickandmortyapi.com/api/character">Api</a> API WebService Not responding</h1>
                </div>
                `
                );
                const html=template(
                    {
                        products: data
                    }
                )
                document.querySelector("#productos").innerHTML=html
                console.log("test")
        })
}

const compileError = () => {
        document.querySelector("#test").innerHTML=        
        `
        <br><br>
        <div class="container"> 
            <h1 style="color: blue;">No se encontraron productos</h1>
            <div class="d-flex justify-content-center align-items-center" style="height:50vh">
                <img src="https://www.iamqatar.qa/assets/images/no-products-found.png" alt="">
            </div>
        </div>
        `
}