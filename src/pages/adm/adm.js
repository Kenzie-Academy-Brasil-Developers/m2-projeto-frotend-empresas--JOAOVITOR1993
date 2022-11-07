import { 
    buscarDepartamentosPorEmpresa, 
    buscarTodasEmpresas, 
    buscarTodosDepartamentos, 
    buscarTodosUsuarios, 
    buscarTodosUsuariosSemDepartamento, 
    contratarFuncionario, 
    criarDepartamento, 
    deletarDepartamento, 
    deletarUsuarioAdm, 
    demitirFuncionario, 
    editarDepartamento, 
    editarUsuarioAdm,
} from "../../scripts/requests.js"
import { validarPermissao } from "../user/user.js"

validarPermissao(buscarTokenLocalSotarage())

function buscarTokenLocalSotarage(){
    return JSON.parse(localStorage.getItem("@usuario:token"))
}


export function retirarMensagens(){
    const mensagemErro = document.querySelector(".mensagemErro")
    mensagemErro.classList.add("fecharModal")

    const mensagemSucesso = document.querySelector(".mensagemSucesso")
    mensagemSucesso.classList.add("fecharModal")
}

export async function verificarSeUsuarioAdm(token){
    const resposta = await fetch("http://localhost:6278/auth/validate_user", {
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

if(buscarTokenLocalSotarage()){
    const resp = await verificarSeUsuarioAdm(buscarTokenLocalSotarage())
if(resp.is_admin === true){
    async function renderizarEmpresasPagAdm(array){
        const select = document.querySelector(".empresas")
       
        array.forEach(elemento =>{
            const option = document.createElement("option")
            option.innerText = elemento.name
            select.appendChild(option)
        })
    
        select.addEventListener("change", async () =>{
            const id = await buscarIdEmpresa(select.value)
            const token = buscarTokenLocalSotarage()
            const array = await buscarDepartamentosPorEmpresa(id, token)
            renderizarDepartamentos(array)
         })
     
    }
    renderizarEmpresasPagAdm(await buscarTodasEmpresas())
    
    async function buscarIdEmpresa(selectValue){
        const arrayEmpresas = await buscarTodasEmpresas()
        let id = ""
        arrayEmpresas.forEach(elemento =>{
            if(selectValue === elemento.name){
                id = elemento.uuid
            }
        })
        return id
    }
    
    async function buscarIdUsuario(selectValue){
        const arrayUsuarios = await buscarTodosUsuarios(buscarTokenLocalSotarage())
        let id = ""
        arrayUsuarios.forEach(elemento =>{
            if(selectValue === elemento.username){
                id = elemento.uuid
            }
        })
        return id
    }
    
    async function renderizarDepartamentos(array){
        const ul = document.querySelector(".ulDepartamentos")
        ul.innerHTML=""
    
        array.forEach(async elemento =>{
            const li = await criarLiDepartamentos(elemento)
            ul.appendChild(li)
        })
    }
    renderizarDepartamentos(await buscarTodosDepartamentos(buscarTokenLocalSotarage()))
    
    async function criarLiDepartamentos(elemento){
        const li = document.createElement("li")
        const h3 = document.createElement("h3")
        const pDescr = document.createElement("p")
        const pNome = document.createElement("p")
        const div = document.createElement("div")
        const buttonVer = document.createElement("button")
        buttonVer.addEventListener("click", async () =>{
            modalVisulizarDepartamento(elemento)
            await renderizarFuncionariosDepartamento(elemento)
            await renderizarUsuariosSemDepOptions()
        
        })
        const imgVer = document.createElement("img")
        const buttonEdt = document.createElement("button")
        buttonEdt.addEventListener("click", () =>{
            modalEditarDepartamento(elemento)
        })
        const imgEdt = document.createElement("img")
        const buttonExc = document.createElement("button")
        buttonExc.addEventListener("click", () =>{
            modalExcluirDepartamento(elemento)
        })
        const imgExc = document.createElement("img")
    
        h3.innerText = elemento.name
        pDescr.innerText = elemento.description
        pNome.innerText = elemento.companies.name
        imgVer.src = "/src/assets/icons/Vector.png"
        imgEdt.src = "/src/assets/icons/Vector (1).png"
        imgExc.src = "/src/assets/icons/Vector (2).png"
    
        li.append(h3, pDescr, pNome, div)
        div.append(buttonVer, buttonEdt, buttonExc)
        buttonVer.appendChild(imgVer)
        buttonEdt.appendChild(imgEdt)
        buttonExc.appendChild(imgExc)
    
        return li
    }
    
    
    
    async function modalCadastrarDepartamentos(){
        document.querySelector("#botaoCriarDep").addEventListener("click", async () =>{
            const body = document.querySelector("body")
    
            const divModal = document.createElement("div")
            const div = document.createElement("div")
            const h4 = document.createElement("h4")
            const buttonFechar = document.createElement("button")
            const img = document.createElement("img")
            const inputNome = document.createElement("input")
            const inputDescricao = document.createElement("input")
            const select = document.createElement("select")
            const option = document.createElement("option")
            const buttonCriar = document.createElement("button")
    
            divModal.className = "modal"
            div.className ="modalCriarDepartamento"
            h4.innerText = "Criar Departamento"
            buttonFechar.className = "botaoFecharModal"
            buttonFechar.addEventListener("click", ()=>{
                divModal.remove()
                retirarMensagens()
            })
            img.src = "/src/assets/icons/Vector (3).png"
            inputNome.placeholder = "Nome do departamento"
            inputNome.type = "text"
            inputNome.required = "true"
            inputDescricao.placeholder = "Descrição"
            inputDescricao.type = "text"
            inputNome.required = "true"
    
            option.innerText = "Selecionar empresa"
            select.appendChild(option)
            
            const arrayEmpresas = await buscarTodasEmpresas()
            arrayEmpresas.forEach(elemento =>{
                const option = document.createElement("option")
                option.innerText = elemento.name
                select.appendChild(option)
            })
       
    
            buttonCriar.className = "botaoPadraoForm botaoAzul"
            buttonCriar.innerText = "Criar o Departamento"
            buttonCriar.type = "submit"
            buttonCriar.addEventListener("click", async (event)=>{
                event.preventDefault()
                const token = buscarTokenLocalSotarage()
                const objeto = {
                    name: inputNome.value,
                    description: inputDescricao.value,
                    company_uuid: await buscarIdEmpresa(select.value)
                }
                await criarDepartamento(token, objeto)
                
            })
    
            body.appendChild(divModal)
            divModal.appendChild(div)
            div.append(h4, buttonFechar, inputNome, inputDescricao, select, buttonCriar)
            buttonFechar.appendChild(img)
        })
    }
    modalCadastrarDepartamentos()
    
    
    function renderizarUsuariosCadastrados(array){
        const ul = document.querySelector(".ulUsuariosCadastrados")
        ul.innerHTML = ""
        array.forEach(async elemento =>{
            if(!elemento.is_admin){
                const li = await criarLiUsuariosCadastrados(elemento)
                ul.appendChild(li)
            }
        })
    }
    renderizarUsuariosCadastrados(await buscarTodosUsuarios(buscarTokenLocalSotarage()))
    
    async function criarLiUsuariosCadastrados(objeto){
        const li = document.createElement("li")
        const h3 = document.createElement("h3")
        const pNivel = document.createElement("p")
        const pEmpresa = document.createElement("p")
        const div = document.createElement("div")
        const buttonEditar = document.createElement("button")
        buttonEditar.addEventListener("click", () =>{
            editarUsuario(objeto)
        })
        const imgEditar = document.createElement("img")
        const buttonExcluir = document.createElement("button")
        buttonExcluir.addEventListener("click", () =>{
            deletarUsuario(objeto)
        })
        const imgExcluir = document.createElement("img")
    
        h3.innerText = objeto.username
        pNivel.innerText = objeto.professional_level

        pEmpresa.innerText = await buscarEmpresaPorDepartamento(objeto.department_uuid)
        
        imgEditar.src = "/src/assets/icons/Vector (1).png"
        imgExcluir.src = "/src/assets/icons/Vector (2).png"
    
        li.append(h3, pNivel, pEmpresa, div)
        div.append(buttonEditar, buttonExcluir)
        buttonEditar.appendChild(imgEditar)
        buttonExcluir.appendChild(imgExcluir)
    
        return li
    }

    async function buscarEmpresaPorDepartamento(idDepartamento){
        const departamentos =  await buscarTodosDepartamentos(buscarTokenLocalSotarage())
        let empresa = ""
        departamentos.find(departamento =>{ 
            if(departamento.uuid === idDepartamento){
                empresa = departamento.companies.name    
            }
        })
       return empresa
    }
    
    
    async function modalVisulizarDepartamento(objeto){
        const body = document.querySelector("body")
    
        const divModal = document.createElement("div")
        const divDep = document.createElement("div")
        const divCab = document.createElement("div")
        const h4 = document.createElement("h4")
        const buttonFechar = document.createElement("button")
        const img = document.createElement("img")
        const divDescrSelect = document.createElement("div")
        const divDescr = document.createElement("div")
        const pDescr = document.createElement("p")
        const pEmpresa = document.createElement("p")
        const divSelect = document.createElement("div")
        const select = document.createElement("select")
        const buttonContratar = document.createElement("button")
        const ul = document.createElement("ul")
        
        divModal.className = "modal"
        divDep.className = "modalDepartamento"
        h4.innerText = objeto.name
        buttonFechar.className = "botaoFecharModal"
        buttonFechar.addEventListener("click", () =>{
            divModal.remove()
        })
        img.src = "/src/assets/icons/Vector (3).png"
        pDescr.innerText = objeto.description
        pEmpresa.innerText = objeto.companies.name
        select.className = "selectUsuarios"
        buttonContratar.className = "botaoPadrao botaoVerde"
        buttonContratar.innerText = "Contratar"
        buttonContratar.addEventListener("click", async ()=>{
           const id = await buscarIdUsuario(select.value)
           const idDepartamento = objeto.uuid
           const teste = {
            user_uuid: id,
            department_uuid: idDepartamento
        }
        await contratarFuncionario(buscarTokenLocalSotarage(), teste)
        await renderizarFuncionariosDepartamento(objeto)
        await renderizarUsuariosSemDepOptions()
        })
        ul.className = "ulFuncionarios"
    
        divModal.appendChild(divDep)
        divDep.append(divCab, divDescrSelect, ul)
        divCab.append(h4, buttonFechar)
        buttonFechar.appendChild(img)
        divDescrSelect.append(divDescr, divSelect)
        divDescr.append(pDescr, pEmpresa)
        divSelect.append(select, buttonContratar)
        body.appendChild(divModal)
    }
    
    async function renderizarFuncionariosDepartamento(objeto){
        const usuariosFiltrados = []
        const listaTodooUsuarios = await buscarTodosUsuarios(buscarTokenLocalSotarage())
        listaTodooUsuarios.forEach(async elemento =>{  
            if(elemento.department_uuid === objeto.uuid){
                usuariosFiltrados.push(elemento)
            }
        })
    
        const ul = document.querySelector(".ulFuncionarios")
        if(ul){
            ul.innerHTML = ""
            usuariosFiltrados.forEach(elemento =>{
            const li = criarLiFuncionariosDepartamento(elemento, objeto)
            ul.appendChild(li)
        })
    
        }
    }
    
    function criarLiFuncionariosDepartamento(elemento, objeto){
        const li = document.createElement("li")
        const h5 = document.createElement("h5")
        const pNivel = document.createElement("p")
        const pLiEmpresa = document.createElement("p")
        const divButton = document.createElement("div")
        const buttonDesligar = document.createElement("button")
    
        h5.innerText = elemento.username
        pNivel.innerText = elemento.professional_level
        pLiEmpresa.innerText = objeto.companies.name
        buttonDesligar.className = "botaoPadrao botaoVermelho"
        buttonDesligar.innerText = "Desligar"
    
        buttonDesligar.addEventListener("click", async () =>{
            const id = elemento.uuid
            await demitirFuncionario(buscarTokenLocalSotarage(), id)
            await renderizarFuncionariosDepartamento(objeto)
            await renderizarUsuariosSemDepOptions()
        })
    
        li.append(h5, pNivel, pLiEmpresa, divButton)
        divButton.append(buttonDesligar)
    
        return li
    }
    
    
    async function renderizarUsuariosSemDepOptions(){
        const select = document.querySelector(".selectUsuarios")
        if(select){
            select.innerHTML = ""
            const option = document.createElement("option")
            option.innerText = "Selecionar usuário"
            select.appendChild(option)
            const arrayUsuariosSemDep = await buscarTodosUsuariosSemDepartamento(buscarTokenLocalSotarage())
            arrayUsuariosSemDep.forEach(elemento =>{
                const option = document.createElement("option")
                option.innerText = elemento.username
                select.appendChild(option)
            })
        }
    }
    
    async function modalEditarDepartamento(elemento){
        const body = document.querySelector("body")
    
        const divModal = document.createElement("div")
        const divModalEditar = document.createElement("div")
        const h4 = document.createElement("h4")
        const buttonFechar = document.createElement("button")
        const img = document.createElement("img")
        const textarea = document.createElement("textarea")
        const buttonSalvar = document.createElement("button")
    
        divModal.className = "modal"
        divModalEditar.className = "modalEditarDepartamento"
        h4.innerText = "Editar Departamento"
        buttonFechar.className = "botaoFecharModal"
        buttonFechar.addEventListener("click", () =>{
            divModal.remove()
        })
        img.src = "/src/assets/icons/Vector (3).png"
        textarea.cols = "30"
        textarea.rows = "10"
        textarea.required ="true"
        textarea.value = elemento.description
        buttonSalvar.className = "botaoPadraoForm botaoAzul"
        buttonSalvar.innerText = "Salvar alterações"
        buttonSalvar.addEventListener("click", async () =>{
            const objeto = {
                description: textarea.value
            }
            const token = buscarTokenLocalSotarage()
            const id = elemento.uuid
    
            await editarDepartamento(token, id, objeto)
            renderizarDepartamentos(await buscarTodosDepartamentos(buscarTokenLocalSotarage()))
            divModal.remove()
        })
    
        divModal.appendChild(divModalEditar)
        divModalEditar.append(h4, buttonFechar, textarea, buttonSalvar)
        buttonFechar.appendChild(img)
        body.appendChild(divModal)
    }
    
    async function modalExcluirDepartamento(elemento){
        const body = document.querySelector("body")
    
        const divModal = document.createElement("div")
        const divDeletar = document.createElement("div")
        const h4 = document.createElement("h4")
        const buttonFechar = document.createElement("button")
        const img = document.createElement("img")
        const buttonConfirmar = document.createElement("button")
    
        divModal.className = "modal"
        divDeletar.className = "modalDeletarDepartamento" 
        h4.innerText = `Realmente deseja deletar o Departamento ${elemento.name} e demitir seus funcionários?`
        buttonFechar.className = "botaoFecharModal"
        buttonFechar.addEventListener("click", ()=>{
            divModal.remove()
        })
        img.src = "/src/assets/icons/Vector (3).png"
        buttonConfirmar.className = "botaoPadraoForm botaoVerde"
        buttonConfirmar.innerText = "Confirmar"
        buttonConfirmar.addEventListener("click", async ()=>{
            const id = elemento.uuid
            const token = buscarTokenLocalSotarage()
    
            await deletarDepartamento(token, id)
            renderizarDepartamentos(await buscarTodosDepartamentos(buscarTokenLocalSotarage()))
            divModal.remove()
        })
    
        divModal.appendChild(divDeletar)
        divDeletar.append(h4, buttonFechar, buttonConfirmar)
        buttonFechar.appendChild(img)
        body.appendChild(divModal)
    }
    
    
    async function editarUsuario(elemento){
        const body = document.querySelector("body")
    
        const divModal = document.createElement("div")
        const divEditarUsuario = document.createElement("div")
        const h4 = document.createElement("h4")
        const buttonFechar = document.createElement("button")
        const img = document.createElement("img")
        const selectModalidade = document.createElement("select")
        const selectNivel = document.createElement("select")
        const buttonEditar = document.createElement("button")
        
        divModal.className = "modal"
        divEditarUsuario.className = "modalEditarUsuario"
        h4.innerText = "Editar Usuário"
        buttonFechar.className = "botaoFecharModal"
        buttonFechar.addEventListener("click", ()=>{
            divModal.remove()
        })
        img.src = "/src/assets/icons/Vector (3).png"
        selectModalidade.insertAdjacentHTML("afterbegin", `
        <option>Selecionar modalidade de trabalho</option>
        <option>home office</option>
        <option>presencial </option>
        <option>híbrido</option>
        `)
        selectNivel.insertAdjacentHTML("afterbegin", `
        <option>Nível profissional</option>
        <option>estágio</option>
        <option>júnior</option>
        <option>pleno</option>
        <option>sênior</option>
        `)
        buttonEditar.className = "botaoPadraoForm botaoAzul"
        buttonEditar.innerText = "Editar"
        buttonEditar.addEventListener("click", async () =>{
            const objeto = {
                kind_of_work: selectModalidade.value,
                professional_level: selectNivel.value
            }
            const id = elemento.uuid
            const token = buscarTokenLocalSotarage()
            
            await editarUsuarioAdm(token, id, objeto)
            renderizarUsuariosCadastrados(await buscarTodosUsuarios(buscarTokenLocalSotarage()))
            divModal.remove()
        })
    
        divModal.appendChild(divEditarUsuario)
        divEditarUsuario.append(h4, buttonFechar, selectModalidade, selectNivel, buttonEditar)
        buttonFechar.appendChild(img)
    
        body.appendChild(divModal)
    }
    
    async function deletarUsuario(elemento){
        const body = document.querySelector("body")
    
        const divModal = document.createElement("div")
        const divDeletarUsuario = document.createElement("div")
        const h4 = document.createElement("h4")
        const buttonFechar = document.createElement("button")
        const img = document.createElement("img")
        const buttonDeletar = document.createElement("button")
    
        divModal.className = "modal"
        divDeletarUsuario.className = "modalDeletarUsuario"
        h4.innerText = `Realmente deseja remover o usuário ${elemento.username}?`
        buttonFechar.className = "botaoFecharModal"
        buttonFechar.addEventListener("click", ()=>{
            divModal.remove()
        })
        img.src = "/src/assets/icons/Vector (3).png"
        buttonDeletar.className = "botaoPadraoForm botaoVerde"
        buttonDeletar.innerText = "Deletar"
        buttonDeletar.addEventListener("click", async ()=>{
            const token = buscarTokenLocalSotarage()
            const id = elemento.uuid
            await deletarUsuarioAdm(token, id)
            renderizarUsuariosCadastrados(await buscarTodosUsuarios(buscarTokenLocalSotarage()))
            divModal.remove()
        })
    
        divModal.appendChild(divDeletarUsuario)
        divDeletarUsuario.append(h4, buttonFechar, buttonDeletar)
        buttonFechar.appendChild(img)
    
        body.appendChild(divModal)
    }
    
    function logout(){
        document.querySelector("#botaoLogout").addEventListener("click", ()=>{
            window.location.assign("/index.html")
            localStorage.removeItem("@usuario:token")
        })
    }
    logout()
}

}


