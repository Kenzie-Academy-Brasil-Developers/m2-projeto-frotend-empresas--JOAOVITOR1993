import { cadastrarUsuario } from "../../scripts/requests.js";

function botoesRedirecionar(){
    document.querySelector("#botaoHome").addEventListener("click", () =>{
        window.location.assign("/index.html")
    })
    document.querySelector("#botaoLogin").addEventListener("click", () =>{
        window.location.assign("../login/login.html")
    })
}
botoesRedirecionar()

async function cadastro(){
    const nome = document.querySelector(".nomeCadastro")
    const email = document.querySelector(".emailCadastro")
    const senha = document.querySelector(".senhaCadastro")
    const nivel = document.querySelector(".nivelCadastro")

    document.querySelector("#botaoCadastrar").addEventListener("click", async (event) =>{
        event.preventDefault()
        const novoUsuario = {
	        username: nome.value,
	        password: senha.value,
	        email: email.value,
	        professional_level: nivel.value
        }
       await cadastrarUsuario(novoUsuario)
    })
    
    document.querySelector("#botaoRetornar").addEventListener("click", () =>{
        window.location.assign("/index.html")
    })
}
cadastro()



