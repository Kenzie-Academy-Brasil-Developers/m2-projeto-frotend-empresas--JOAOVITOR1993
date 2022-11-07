import { 
    verificarTipoUsuario,
    buscarFuncionariosDoMesmoDepart, 
    buscarInfUsuarioLogado, 
    buscarTodosDepartamentosUsuarioLogado, 
    editarInfoUsuario 
} from "../../scripts/requests.js";

function buscarTokenUsuarioLocalStorage(){
    return JSON.parse(localStorage.getItem("@usuario:token"))
}

const urlAtual = window.location

export async function validarPermissao(buscarToken){
    const token = buscarToken
    const verificarAdm = await verificarTipoUsuario(token)
   
    if(!token && urlAtual.pathname === "/src/pages/adm/adm.html" || !token && urlAtual.pathname === "/src/pages/user/user.html"){
        window.location.assign("/index.html")
    }
    if(verificarAdm.is_admin && urlAtual.pathname === "/src/pages/user/user.html"){
        window.location.assign("/src/pages/adm/adm.html")
    }
    if(!verificarAdm.is_admin && urlAtual.pathname === "/src/pages/adm/adm.html"){
        window.location.assign( "/src/pages/user/user.html")
    }
}
validarPermissao(buscarTokenUsuarioLocalStorage())


if(buscarTokenUsuarioLocalStorage() && urlAtual.pathname === "/src/pages/user/user.html"){
    const resp = await verificarTipoUsuario(buscarTokenUsuarioLocalStorage())
    if(!resp.is_admin){
        async function renderizarInfoUsuarioLogado(objeto){
            const nome = document.querySelector(".nome")
            const email = document.querySelector(".email")
            const nivel = document.querySelector(".nivel")
            const modalidade = document.querySelector(".modalidade")
            const empresa = document.querySelector(".empresa")
            const departamento = document.querySelector(".departamento")
            
            nome.innerText = objeto.username
            email.innerText = objeto.email
            nivel.innerText = objeto.professional_level
            modalidade.innerText = objeto.kind_of_work
            
            
            if(objeto.department_uuid === null){
                const main = document.querySelector("main")
                main.insertAdjacentHTML("beforeend", `
                <div class="mensagem container">
                    <h2>Você ainda não foi contratado</h2>
                </div>
                `)
        
                const caixaFunc = document.querySelector(".empresaEColegas")
                caixaFunc.remove()
            }else{
                const elemento = await buscarTodosDepartamentosUsuarioLogado(buscarTokenUsuarioLocalStorage())
                empresa.innerText = elemento.name
                
                elemento.departments.forEach(objDepart => {
                    if(objDepart.uuid === objeto.department_uuid){
                        departamento.innerText = objDepart.name
                    }
                })
        
                renderizarFuncionariosDepartUsuario(await buscarFuncionariosDoMesmoDepart(buscarTokenUsuarioLocalStorage()))
            } 
        }
        renderizarInfoUsuarioLogado(await buscarInfUsuarioLogado(buscarTokenUsuarioLocalStorage()))
        
        async function renderizarFuncionariosDepartUsuario(array){
           const ul = document.querySelector(".ulFuncionarios")
           ul.innerHTML =""
           
           array.forEach(elemento =>{
            elemento.users.forEach(funcionario =>{
                const li = document.createElement("li")
                const h3 = document.createElement("h3")
                const p = document.createElement("p")
            
                h3.innerText = funcionario.username
                p.innerText = funcionario.professional_level
            
                li.append(h3, p)
                ul.append(li)
            })
          
           })
        }
        
        async function modalEditarPerfil(){
            const body = document.querySelector("body")
        
            const divModal = document.createElement("div")
            const divModalEditar = document.createElement("div")
            const divCab = document.createElement("div")
            const h2 = document.createElement("h2")
            const buttonFechar = document.createElement("button")
            const img = document.createElement("img")
            const inputNome = document.createElement("input")
            const inputEmail = document.createElement("input")
            const inputSenha = document.createElement("input")
            const buttonEditar = document.createElement("button")
        
            divModal.className = "modal"
            divModalEditar.className = "modalEditarPerfil"
            h2.innerText = "Editar Perfil"
            buttonFechar.className = "botaoFecharModal"
            buttonFechar.addEventListener("click", ()=>{
                divModal.remove()
            })
            img.src = "/src/assets/icons/Vector (3).png"
            inputNome.type = "text"
            inputNome.placeholder = "Seu nome"
            inputNome.required = "true"
            inputEmail.type = "email"
            inputEmail.placeholder = "Seu e-mail"
            inputEmail.required = "true"
            inputSenha.type = "password"
            inputSenha.placeholder = "Sua senha"
            inputSenha.required = "true"
            buttonEditar.className = "botaoPadraoForm botaoAzul"
            buttonEditar.type = "submit"
            buttonEditar.innerText = "Editar Perfil"
            buttonEditar.type = "submit"
            buttonEditar.addEventListener("click", async (event)=>{
                event.preventDefault()
                const objeto = {
                    username: inputNome.value,
                    password: inputSenha.value,
                    email: inputEmail.value
                }
                const token = buscarTokenUsuarioLocalStorage()
                await editarInfoUsuario(token, objeto)
                renderizarInfoUsuarioLogado(await buscarInfUsuarioLogado(buscarTokenUsuarioLocalStorage()))
                divModal.remove()
            })
        
            divModal.appendChild(divModalEditar)
            divModalEditar.append(divCab, inputNome, inputEmail, inputSenha, buttonEditar)
            divCab.append(h2, buttonFechar)
            buttonFechar.appendChild(img)
            body.appendChild(divModal)
        }
        document.querySelector(".editarUsuario").addEventListener("click", ()=>{
            modalEditarPerfil()
        })
        
        function logoutUsuario(){
            document.querySelector("#botaoLogoutUsuario").addEventListener("click", ()=>{
                window.location.assign("/index.html")
                localStorage.removeItem("@usuario:token")
            })
        }
        logoutUsuario()
    }
    }
    



