
const login = () =>{
    var user = document.getElementById("user").value;
    var pass = document.getElementById("pass").value;
    if(user==='' || pass===''){
        alert("por favor ingresa usuario y contraseña ")
    }else{
        fetch(`log`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user": `${user}`,
                "pass": `${pass}`
            })
        })
        .then(res=>{
            res.json()
        })
        .then(data=>{
            console.log(data)
            console.log("Sesión Iniciada")
            location.replace("/");
        })
        .catch(err=>{console.log(err)
        })
    }
}