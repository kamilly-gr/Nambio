document.addEventListener('DOMContentLoaded', function () {
    // Carregar dados do localStorage
    const dadosSalvos = localStorage.getItem('usuarioPerfil');
    if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);

        const setValor = (id, valor) => {
            const el = document.getElementById(id);
            if (el) el.value = valor || '';
        };

        setValor('nome', usuario.nome);
        setValor('email-acesso', usuario.email);
        setValor('username', usuario.username);
        setValor('tele-acesso', usuario.tel);
        setValor('nasc', usuario.nasc);
        setValor('cpf', usuario.cpf);

        const senhaInput = document.getElementById('senha');
        if (senhaInput) {
            senhaInput.value = '••••••';
            senhaInput.dataset.senhaReal = usuario.senha || '';
        }

        // Restaurar gênero
        if (usuario.genero) {
            const radio = document.getElementById(usuario.genero);
            if (radio) radio.checked = true;
        }
    }

    // Aplicar estado inicial: todos desabilitados (já estão no HTML, mas garantimos)
    const caminhoAtual = window.location.pathname;

    if (caminhoAtual.includes("perfil.html")) {
        // Se o caminho contiver o nome da página desejada, execute a função
        aplicarModoVisualizacao();
    }

    // Listeners para rádios (só para atualizar visualização ao selecionar)
    document.querySelectorAll('input[name="genero"]').forEach(radio => {
        radio.addEventListener('change', verificarRadio);
    });
});

// ================================
// Funções de utilidade
// ================================

function aplicarModoVisualizacao() {
    const campos = ['nome', 'username', 'nasc', 'cpf', 'email-acesso', 'tele-acesso', 'senha']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const radios = ['masc', 'fem', 'outro', 'prefiroN']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    // Desabilitar campos
    campos.forEach(campo => {
        campo.disabled = true;
        campo.readOnly = true;
        campo.classList.add('disabled');
    });

    // Desabilitar rádios
    radios.forEach(radio => {
        radio.disabled = true;
    });

    // Atualizar visibilidade dos gêneros
    verificarRadio();
}

function aplicarModoEdicao() {
    const campos = ['nome', 'username', 'nasc', 'cpf', 'email-acesso', 'tele-acesso', 'senha']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const radios = ['masc', 'fem', 'outro', 'prefiroN']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const containers = ['mascInput', 'femInput', 'outroInput', 'prefiroNInput']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    // Habilitar campos
    campos.forEach(campo => {
        campo.disabled = false;
        campo.readOnly = false;
        campo.classList.remove('disabled');
    });

    // Habilitar rádios
    radios.forEach(radio => {
        radio.disabled = false;
    });

    // Mostrar todos os containers de gênero
    containers.forEach(container => {
        container.style.display = '';
    });

    // Foco no primeiro campo
    const primeiro = document.getElementById('nome');
    if (primeiro) primeiro.focus();
}

// ================================
// Edição individual (usada pelos links "Alterar X")
// ================================

function habilitarEdicaoIndividual(elementoId, mascaraFn = null) {
    const el = document.getElementById(elementoId);
    if (!el || !el.disabled) return; // só habilita se estiver desabilitado

    el.disabled = false;
    el.readOnly = false;
    el.classList.remove('disabled');
    el.focus();

    if (mascaraFn) {
        const handler = (e) => mascaraFn(e);
        el.addEventListener('input', handler);
        el._mascaraHandler = handler; // guardar referência para remover depois
    }
}

function removerEdicaoIndividual(elementoId) {
    const el = document.getElementById(elementoId);
    if (!el) return;

    // Remover máscara se existir
    if (el._mascaraHandler) {
        el.removeEventListener('input', el._mascaraHandler);
        delete el._mascaraHandler;
    }

    // Reaplicar modo visualização
    aplicarModoVisualizacao();
}

// Funções específicas de edição individual
function mudarEmail() {
    habilitarEdicaoIndividual('email-acesso');
}
function mudarTele() {
    habilitarEdicaoIndividual('tele-acesso', formatarTelefone);
}

// ================================
// Máscara de Telefone
// ================================

function formatarTelefone(event) {
    let input = event.target;
    input.value = input.value.replace(/\D/g, "");

    let value = input.value;
    if (value.length > 0) value = "(" + value;
    if (value.length > 3) value = value.slice(0, 3) + ") " + value.slice(3);
    if (value.length > 10) value = value.slice(0, 10) + "-" + value.slice(10);
    if (value.length > 15) value = value.slice(0, 15);

    input.value = value;
}

// ================================
// Gênero
// ================================

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
            const container = document.getElementById(item.container);
            if (container) {
                container.style.display = (item.id === selecionado.id) ? '' : 'none';
            }
        });
    } else {
        // Nenhum selecionado → mostrar todos (só acontece no modo edição)
        itens.forEach(item => {
            const container = document.getElementById(item.container);
            if (container) container.style.display = '';
        });
    }
}

// ================================
// Botões principais
// ================================

function alterarPesso() {
    aplicarModoEdicao();
}

function salvarPerfil() {
    // Coletar gênero
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
        username: document.getElementById('username')?.value.trim() || '',
        tel: document.getElementById('tele-acesso')?.value.trim() || '',
        nasc: document.getElementById('nasc')?.value || '',
        senha: document.getElementById('senha')?.dataset.senhaReal || '',
        cpf: document.getElementById('cpf')?.value.trim() || '',
        genero: genero
    };

    localStorage.setItem('usuarioPerfil', JSON.stringify(perfil));

    // Voltar ao modo visualização
    aplicarModoVisualizacao();

    // Feedback opcional (pode remover)
    console.log('Perfil salvo com sucesso!');
}

// ================================
// Função de mostrar/ocultar senha (adicione se quiser)
// ================================

function mostrarSenha() {
    const senhaInput = document.getElementById('senha');
    const botao = document.getElementById('botao-senha');
    if (!senhaInput || !botao) return;

    const isPassword = senhaInput.type === 'password';
    senhaInput.type = isPassword ? 'text' : 'password';
    botao.style.backgroundImage = isPassword
        ? 'url("/Nambio/assets/icons/olho-senha-aberto.svg")'
        : 'url("/Nambio/assets/icons/olho-senha-fechado.svg")';
}

// ================================
// Logout (você tem no HTML)
// ================================

function fazerLogout() {
    // Exemplo básico — adapte conforme sua lógica de login
    localStorage.removeItem('usuarioLogado'); // ou como você controla login
    localStorage.removeItem('usuarioPerfil');
    window.location.href = 'loginAluno.html';
}

// ================================
// Ajuste do tamanho do input de senha (opcional)
// ================================

const inputSenha = document.getElementById('senha');
if (inputSenha) {
    function atualizarTamanhoInput() {
        const comprimentoTexto = inputSenha.value.length;
        inputSenha.size = Math.max(6, comprimentoTexto + 1);
    }
    inputSenha.addEventListener('input', atualizarTamanhoInput);
    // Inicial
    if (inputSenha.value === '••••••') {
        inputSenha.size = 6;
    } else {
        atualizarTamanhoInput();
    }
}

function mostrarPopupNovaSenha() {
  const overlay = document.getElementById('popup-nova-senha-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    // Limpar campos ao abrir
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
  const antigaSenha = document.getElementById('antigaSenha').value.trim();
  const novaSenha = document.getElementById('novaSenha').value.trim();
  const confirmNovaSenha = document.getElementById('confirmNovaSenha').value.trim();

  // Validação: todos os campos preenchidos
  if (!antigaSenha || !novaSenha || !confirmNovaSenha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Validação: nova senha ≠ antiga senha
  if (novaSenha === antigaSenha) {
    alert("A sua nova senha não pode ser igual à senha antiga!");
    return;
  }

  // Validação: confirmação coincide
  if (novaSenha !== confirmNovaSenha) {
    alert("A confirmação da senha não corresponde à nova senha!");
    return;
  }

  alert("Nova senha criada com sucesso!");

  // Atualizar no localStorage
  const dadosSalvos = localStorage.getItem('usuarioPerfil');
  if (dadosSalvos) {
    const usuario = JSON.parse(dadosSalvos);
    usuario.senha = novaSenha;
    localStorage.setItem('usuarioPerfil', JSON.stringify(usuario));
  }

  fecharPopupNovaSenha();
}