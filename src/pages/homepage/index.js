import { buscarEmpresasSetores, buscarTodasEmpresas, buscarTodosSetores } from "../../scripts/requests.js";

async function renderizarSetores(array){
    const select = document.querySelector(".selectSetores")

    array.forEach(elemento =>{
        const option = document.createElement("option")
        option.innerText = elemento.description
        select.appendChild(option)
    })
} 
renderizarSetores(await buscarTodosSetores())

async function renderizarEmpresas(array){
    const ul = document.querySelector(".ulEmpresasFiltradas")
    ul.innerHTML =""

    array.forEach(elemento =>{
        const li = criarLiEmpresas(elemento)
        ul.appendChild(li)
    })
}
renderizarEmpresas(await buscarTodasEmpresas())

function criarLiEmpresas(objeto){
    const li = document.createElement("li")
    const h2 = document.createElement("h2")
    const pHoras = document.createElement("p")
    const pSetor = document.createElement("p")

    h2.innerText = objeto.name
    pHoras.innerText = objeto.opening_hours
    pSetor.innerText = objeto.sectors.description

    li.append(h2, pHoras, pSetor)

    return li
}

async function renderizarEmpresasPorSetor(){
    const select = document.querySelector(".selectSetores")

    select.addEventListener("change", async ()=>{
       const setorSecionado = select.value
       const arrayEmpresas = await buscarEmpresasSetores(setorSecionado)
       renderizarEmpresas(arrayEmpresas)
    })
}
renderizarEmpresasPorSetor()

function redirecionarPaginas(){
    document.querySelector(".botaoLogin").addEventListener("click", () =>{
        window.location.assign("src/pages/login/login.html")
    })
    document.querySelector(".botaoCadastro").addEventListener("click", () =>{
        window.location.assign("src/pages/register/register.html")
    })
}
redirecionarPaginas()