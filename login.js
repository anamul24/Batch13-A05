function login(){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value 

    if(username === "admin" && password ==="admin123"){
        localStorage.setItem("login","true")
        window.location.href="index.html"
    }
    else{
        alert("Invalid Username and Password")
    }
    
}