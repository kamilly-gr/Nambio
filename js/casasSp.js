let input = document.getElementById("opcoes");
let clearBtn = document.getElementById("clearBtn");

function mostrarIcone() {
    if (input.value.trim() !== "") { //pega o que está dentro do campo. .trim() remove espaços vazios antes ou depois do texto (pra evitar que o botão apareça se a pessoa só digitar espaços).
        clearBtn.style.display = "block";
    } else {
        clearBtn.style.display = "none";
    }
}

function limparCampo() {
    input.value = "";
    clearBtn.style.display = "none";
    input.focus();
}