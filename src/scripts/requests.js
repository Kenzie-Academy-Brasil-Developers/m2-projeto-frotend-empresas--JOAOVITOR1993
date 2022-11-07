import { retirarMensagens } from "../pages/adm/adm.js"


const url = "http://localhost:6278"
const headers = {"Content-Type": "application/json"}

export async function buscarTodosSetores(){
    const resposta = await fetch(`${url}/sectors`, {
        method: "GET",
        headers: headers
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}

export async function buscarEmpresasSetores(setor){
    const resposta = await fetch(`${url}/companies/${setor}`, {
        method: "GET",
        headers: headers
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}

export async function buscarTodasEmpresas(){
    const resposta = await fetch(`${url}/companies`, {
        method: "GET",
        headers: headers
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}

export async function cadastrarUsuario(objeto){
    const resposta = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(objeto)
    })
    .then(resp => resp.json())
    .then(resp => {
        if(resp.error){
           const mensagemErro = document.querySelector(".mensagemErro")
           mensagemErro.classList.add("ativarMensagem")
        }else{
            const mensagemSucesso = document.querySelector(".mensagemSucesso")
            mensagemSucesso.classList.add("ativarMensagem")
            window.location.assign("/src/pages/login/login.html")
        }
    })
    .catch(err => console.log(err))

    return resposta
}


export async function loginUsuario(objeto){
    const resposta = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(objeto)
    })
    .then(resp => resp.json())
    .then(resp => {
        if(resp.error){
            const mensagemErro = document.querySelector(".mensagemErro")
            mensagemErro.classList.add("ativarMensagem")
         }else{
             const mensagemSucesso = document.querySelector(".mensagemSucesso")
             mensagemSucesso.classList.add("ativarMensagem")

             localStorage.setItem("@usuario:token", JSON.stringify(resp.token))
             verificarTipoUsuario(resp.token)
         }
    })
    .catch(err => console.log(err))

    return resposta
}


export async function verificarTipoUsuario(token){
    await fetch(`${url}/auth/validate_user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        } 
    })
    .then(resp => resp.json())
    .then(resp => {
        if(resp.is_admin){
            window.location.assign("/src/pages/adm/adm.html")
        }else{
            window.location.assign("/src/pages/user/user.html")
        }
      
    })
    .catch(err => console.log(err))
}


export async function buscarDepartamentosPorEmpresa(id, token){
    const resposta = await fetch(`${url}/departments/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        } 
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function buscarTodosDepartamentos(token){
    const resposta = await fetch(`${url}/departments`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        } 
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function criarDepartamento(token, objeto){
    const resposta = await fetch(`${url}/departments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(objeto)
    })
    .then(resp => resp.json())
    .then(resp => {
        if(resp.error){
            const mensagemErro = document.querySelector(".mensagemErro")
            mensagemErro.classList.add("ativarMensagem")
        }else{
            const mensagemSucesso = document.querySelector(".mensagemSucesso")
            mensagemSucesso.classList.add("ativarMensagem")
            setTimeout(function() {
                retirarMensagens()
                const modal = document.querySelector(".modal")
                modal.remove()
              }, 1000)
        }
    })
    .catch(err => console.log(err))

    return resposta
}


export async function buscarTodosUsuarios(token){
    const resposta = await fetch(`${url}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        } 
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function buscarTodosUsuariosSemDepartamento(token){
    const resposta = await fetch(`${url}/admin/out_of_work`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        } 
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function contratarFuncionario(token, objeto){
    const resposta = await fetch(`${url}/departments/hire/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(objeto)
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function demitirFuncionario(token, id){
    const resposta = await fetch(`${url}/departments/dismiss/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function editarDepartamento(token, id, objeto){
    const resposta = await fetch(`${url}/departments/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(objeto)
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function deletarDepartamento(token, id){
    const resposta = await fetch(`${url}/departments/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function editarUsuarioAdm(token, id, objeto){
    const resposta = await fetch(`${url}/admin/update_user/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(objeto)
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}



export async function deletarUsuarioAdm(token, id){
    const resposta = await fetch(`${url}/admin/delete_user/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}



export async function buscarInfUsuarioLogado(token){
    const resposta = await fetch(`${url}/users/profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        } 
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function buscarTodosDepartamentosUsuarioLogado(token){
    const resposta = await fetch(`${url}/users/departments`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        } 
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function buscarFuncionariosDoMesmoDepart(token){
    const resposta = await fetch(`${url}/users/departments/coworkers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        } 
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}


export async function editarInfoUsuario(token, objeto){
    const resposta = await fetch(`${url}/users`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(objeto)
    })
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(err => console.log(err))

    return resposta
}
