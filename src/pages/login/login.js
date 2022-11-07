import { loginUsuario } from "../../scripts/requests.js"

async function login(){
    const email = document.querySelector(".emailLogin")
    const senha = document.querySelector(".senhaLogin")

    document.querySelector("#botaoLogin").addEventListener("click", async (event) =>{
        event.preventDefault()
        const usuario = {
	        email: email.value,
	        password: senha.value,
        }
        await loginUsuario(usuario)
    })
    
    document.querySelector("#botaoCadastrar").addEventListener("click", () =>{
        window.location.assign("/src/pages/register/register.html")
    })
}
login()

function botoesRedirecionarlogin(){
    document.querySelector("#botaoHomeLogin").addEventListener("click", () =>{
        window.location.assign("/index.html")
    })
    document.querySelector("#botaoCadastroLogin").addEventListener("click", () =>{
        window.location.assign("/src/pages/register/register.html")
    })
}
botoesRedirecionarlogin()
