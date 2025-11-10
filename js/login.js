function mostrarSenha(){
    let botao = document.getElementById("botao-senha")
    let campo = document.getElementById("senha")

    if(campo.type === "password"){
        campo.type = "text"
        botao.style.backgroundImage = "url(/Nambio/assets/icons/olho-senha.svg)"
        botao.style.backgroundRepeat ="no-repeat"
        botao.style.backgroundPosition ="center"
        botao.style.backgroundImage = "contain"
    } else{
        campo.type = "password"
        botao.style.backgroundImage = "url(/Nambio/assets/icons/olho-senha-fechado.svg)"
        botao.style.backgroundRepeat ="no-repeat"
        botao.style.backgroundPosition ="center"
        botao.style.backgroundImage = "contain"
    }

}