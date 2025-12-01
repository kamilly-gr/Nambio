// ================================
// FUNÇÕES GLOBAIS (acessíveis via onclick no HTML)
// ================================

function mudarEmail() {
    habilitarEdicaoIndividual('email-acesso');
}

function mudarTele() {
    habilitarEdicaoIndividual('tele-acesso', formatarTelefone);
}

function alterarPesso() {
    aplicarModoEdicao();
}

function salvarPerfil() {
    const caminho = window.location.pathname;
    const ehHost = caminho.includes('perfilHost.html');
    const chave = ehHost ? 'usuarioPerfilHost' : 'usuarioPerfil';

    let genero = '';
    const radios = ['masc', 'fem', 'outro', 'prefiroN'];
    for (const id of radios) {
        const radio = document.getElementById(id);
        if (radio && radio.checked) {
            genero = id;
            break;
        }
    }

    const perfil = {
        nome: document.getElementById('nome')?.value.trim() || '',
        email: document.getElementById('email-acesso')?.value.trim() || '',
        tel: document.getElementById('tele-acesso')?.value.trim() || '',
        nasc: document.getElementById('nasc')?.value || '',
        senha: document.getElementById('senha')?.dataset.senhaReal || '',
        cpf: document.getElementById('cpf')?.value.trim() || '',
        genero: genero
    };

    if (ehHost) {
        perfil.quantComodos = document.getElementById('quantComodos')?.value.trim() || '';
        perfil.rendaFam = document.getElementById('rendaFam')?.value.trim() || '';
        perfil.tipoImovel = document.getElementById('tipoImovel')?.value.trim() || '';
        perfil.falesobreVc = document.getElementById('falesobreVc')?.value.trim() || '';
    }

    localStorage.setItem(chave, JSON.stringify(perfil));
    aplicarModoVisualizacao();
    console.log(`Perfil salvo em "${chave}" com sucesso!`);
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioPerfil');
    localStorage.removeItem('usuarioPerfilHost');
    window.location.href = 'loginAluno.html';
}

function mostrarPopupNovaSenha() {
    const overlay = document.getElementById('popup-nova-senha-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.getElementById('antigaSenha').value = '';
        document.getElementById('novaSenha').value = '';
        document.getElementById('confirmNovaSenha').value = '';
    }
}

function fecharPopupNovaSenha() {
    const overlay = document.getElementById('popup-nova-senha-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function criarNovaSenhaPerfil() {
    const antiga = document.getElementById('antigaSenha').value.trim();
    const nova = document.getElementById('novaSenha').value.trim();
    const confirma = document.getElementById('confirmNovaSenha').value.trim();

    if (!antiga || !nova || !confirma) {
        alert("Preencha todos os campos.");
        return;
    }
    if (nova === antiga) {
        alert("Nova senha não pode ser igual à antiga!");
        return;
    }
    if (nova !== confirma) {
        alert("Senhas não coincidem!");
        return;
    }

    const caminho = window.location.pathname;
    const ehHost = caminho.includes('perfilHost.html');
    const chave = ehHost ? 'usuarioPerfilHost' : 'usuarioPerfil';
    const dados = localStorage.getItem(chave);
    if (dados) {
        const usuario = JSON.parse(dados);
        usuario.senha = nova;
        localStorage.setItem(chave, JSON.stringify(usuario));
    }

    alert("Senha atualizada com sucesso!");
    fecharPopupNovaSenha();
}

function acionarTrocaDeFoto() {
    document.getElementById('inputFotoPerfil')?.click();
}

// ================================
// FUNÇÕES AUXILIARES (também globais, usadas internamente)
// ================================

function habilitarEdicaoIndividual(elementoId, mascaraFn = null) {
    const el = document.getElementById(elementoId);
    if (!el || !el.disabled) return;
    el.disabled = false;
    el.readOnly = false;
    el.classList.remove('disabled');
    el.focus();
    if (mascaraFn) {
        const handler = (e) => mascaraFn(e);
        el.addEventListener('input', handler);
        el._mascaraHandler = handler;
    }
}

function aplicarModoVisualizacao() {
    const caminho = window.location.pathname;
    const ehHost = caminho.includes('perfilHost.html');
    const idsCampos = ehHost
        ? ['nome', 'nasc', 'cpf', 'email-acesso', 'tele-acesso', 'senha', 'quantComodos', 'rendaFam', 'tipoImovel', 'falesobreVc']
        : ['nome', 'nasc', 'cpf', 'email-acesso', 'tele-acesso', 'senha'];

    const campos = idsCamrops
        .map(id => document.getElementById(id))
        .filter(el => el !== null);

    const radios = ['masc', 'fem', 'outro', 'prefiroN']
        .map(id => document.getElementById(id))
        .filter(el => el !== null);

    campos.forEach(campo => {
        campo.disabled = true;
        campo.readOnly = true;
        campo.classList.add('disabled');
    });

    radios.forEach(radio => {
        radio.disabled = true;
    });

    verificarRadio();
}

function aplicarModoEdicao() {
    const caminho = window.location.pathname;
    const ehHost = caminho.includes('perfilHost.html');
    const idsCampos = ehHost
        ? ['nome', 'nasc', 'cpf', 'email-acesso', 'tele-acesso', 'senha', 'quantComodos', 'rendaFam', 'tipoImovel', 'falesobreVc']
        : ['nome', 'nasc', 'cpf', 'email-acesso', 'tele-acesso', 'senha'];

    const campos = idsCampos
        .map(id => document.getElementById(id))
        .filter(el => el !== null);

    const radios = ['masc', 'fem', 'outro', 'prefiroN']
        .map(id => document.getElementById(id))
        .filter(el => el !== null);

    const containers = ['mascInput', 'femInput', 'outroInput', 'prefiroNInput']
        .map(id => document.getElementById(id))
        .filter(el => el !== null);

    campos.forEach(campo => {
        campo.disabled = false;
        campo.readOnly = false;
        campo.classList.remove('disabled');
    });

    radios.forEach(radio => {
        radio.disabled = false;
    });

    containers.forEach(container => {
        container.style.display = '';
    });

    const nomeInput = document.getElementById('nome');
    if (nomeInput) nomeInput.focus();
}

function formatarTelefone(event) {
    let input = event.target;
    input.value = input.value.replace(/\D/g, "");
    let v = input.value;
    if (v.length > 0) v = "(" + v;
    if (v.length > 3) v = v.slice(0, 3) + ") " + v.slice(3);
    if (v.length > 10) v = v.slice(0, 10) + "-" + v.slice(10);
    if (v.length > 15) v = v.slice(0, 15);
    input.value = v;
}

function verificarRadio() {
    const itens = [
        { id: 'masc', container: 'mascInput' },
        { id: 'fem', container: 'femInput' },
        { id: 'outro', container: 'outroInput' },
        { id: 'prefiroN', container: 'prefiroNInput' }
    ];
    const selecionado = itens.find(item => {
        const radio = document.getElementById(item.id);
        return radio && radio.checked;
    });
    if (selecionado) {
        itens.forEach(item => {
            const cont = document.getElementById(item.container);
            if (cont) cont.style.display = (item.id === selecionado.id) ? '' : 'none';
        });
    } else {
        itens.forEach(item => {
            const cont = document.getElementById(item.container);
            if (cont) cont.style.display = '';
        });
    }
}

function mudarFotoDePerfil(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgSrc = e.target.result;
            const img = document.getElementById('imgPerfilHeader');
            if (img) img.src = imgSrc;
            localStorage.setItem('fotoPerfilURL', imgSrc);
            console.log("Foto de perfil atualizada.");
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function carregarFotoSalva() {
    const img = document.getElementById('imgPerfilHeader');
    const foto = localStorage.getItem('fotoPerfilURL');
    if (img && foto) {
        img.src = foto;
    }
}

// ================================
// EXECUÇÃO CONDICIONAL (só em páginas de perfil)
// ================================

const caminho = window.location.pathname;
const ehPaginaDePerfil = caminho.includes('perfil.html') || caminho.includes('perfilHost.html');

if (ehPaginaDePerfil) {
    document.addEventListener('DOMContentLoaded', function () {
        const ehHost = caminho.includes('perfilHost.html');
        const chavePerfil = ehHost ? 'usuarioPerfilHost' : 'usuarioPerfil';

        const dadosSalvos = localStorage.getItem(chavePerfil);
        if (dadosSalvos) {
            const usuario = JSON.parse(dadosSalvos);

            const setValor = (id, valor) => {
                const el = document.getElementById(id);
                if (el) el.value = valor || '';
            };

            setValor('nome', usuario.nome);
            setValor('email-acesso', usuario.email);
            setValor('tele-acesso', usuario.tel);
            setValor('nasc', usuario.nasc);
            setValor('cpf', usuario.cpf);

            const senhaInput = document.getElementById('senha');
            if (senhaInput) {
                senhaInput.value = '••••••';
                senhaInput.dataset.senhaReal = usuario.senha || '';
            }

            if (usuario.genero) {
                const radio = document.getElementById(usuario.genero);
                if (radio) radio.checked = true;
            }

            if (ehHost) {
                setValor('quantComodos', usuario.quantComodos);
                setValor('rendaFam', usuario.rendaFam);
                setValor('tipoImovel', usuario.tipoImovel);
                setValor('falesobreVc', usuario.falesobreVc);
                setValor('add-fotos-casa', usuario.addFotosCasa);
                setValor('estadoCiv', usuario.estadoCivil);
            }
        }

        aplicarModoVisualizacao();

        document.querySelectorAll('input[name="genero"]').forEach(radio => {
            radio.addEventListener('change', verificarRadio);
        });

        const inputSenha = document.getElementById('senha');
        if (inputSenha) {
            function atualizarTamanhoInput() {
                const len = inputSenha.value.length;
                inputSenha.size = Math.max(6, len + 1);
            }
            inputSenha.addEventListener('input', atualizarTamanhoInput);
            if (inputSenha.value === '••••••') {
                inputSenha.size = 6;
            } else {
                atualizarTamanhoInput();
            }
        }

        carregarFotoSalva();

        // Listener para foto de perfil
        const inputFoto = document.getElementById('inputFotoPerfil');
        if (inputFoto) {
            inputFoto.addEventListener('change', mudarFotoDePerfil);
        }

        // === Opcional: adicionar limites de dígitos ===
        const inputComodos = document.getElementById('quantComodos');
        if (inputComodos) {
            inputComodos.addEventListener('input', function () {
                let v = this.value.replace(/\D/g, '');
                if (v.length > 2) v = v.slice(0, 2);
                const num = v === '' ? '' : parseInt(v, 10);
                this.value = num || '';
            });
        }

        const inputRenda = document.getElementById('rendaFam');
        if (inputRenda) {
            inputRenda.addEventListener('input', function () {
                let v = this.value.replace(/\D/g, '');
                if (v.length > 6) v = v.slice(0, 6);
                const num = v === '' ? '' : parseInt(v, 10);
                this.value = num || '';
            });
        }
    });
} else {
    console.log('perfil.js: não executado – não é página de perfil.');
}