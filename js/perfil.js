document.addEventListener('DOMContentLoaded', function () {
    // 1. Recuperar os dados do localStorage
    const dadosSalvos = localStorage.getItem('usuarioPerfil');

    if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);

        // Preencher campos
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
        
        // Senha: não exibir valor real por segurança
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

    // Disparar verificação inicial do gênero
    verificarRadio();
});

// ================================
// Funções de edição genéricas
// ================================

function habilitarEdicao(elementoId, mascaraFn = null, callbackSalvamento = null) {
    const el = document.getElementById(elementoId);
    if (!el) return;

    // Salvar estado original
    if (!el.dataset._saved) {
        el.dataset._origDisabled = String(el.disabled);
        el.dataset._origReadOnly = String(el.readOnly);
        el.dataset._origStyle = el.style.cssText || '';
        el.dataset._origClass = el.className || '';
        el.dataset._saved = 'true';
    }

    // Habilitar
    el.disabled = false;
    el.readOnly = false;
    el.classList.remove('disabled');
    el.focus();

    // Adicionar máscara se necessário
    if (mascaraFn) {
        el.addEventListener('input', mascaraFn);
    }

    // Evitar múltiplos listeners
    if (el.dataset._enterListenerAttached === 'true') return;

    const finalizar = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();

            // Remover máscara
            if (mascaraFn) {
                el.removeEventListener('input', mascaraFn);
            }

            // Salvar dados no localStorage
            salvarPerfil();

            // Restaurar estado original
            el.disabled = el.dataset._origDisabled === 'true';
            el.readOnly = el.dataset._origReadOnly === 'true';
            el.style.cssText = el.dataset._origStyle || '';
            el.className = el.dataset._origClass || '';

            // Limpar dataset
            delete el.dataset._enterListenerAttached;
            delete el.dataset._saved;
            delete el.dataset._origDisabled;
            delete el.dataset._origReadOnly;
            delete el.dataset._origStyle;
            delete el.dataset._origClass;

            el.removeEventListener('keydown', finalizar);
        }
    };

    el.addEventListener('keydown', finalizar);
    el.dataset._enterListenerAttached = 'true';
}

// ================================
// Funções específicas
// ================================

function mudarSenha() {
    habilitarEdicao('senha');
}

function mudarEmail() {
    habilitarEdicao('email-acesso');
}

function mudarTele() {
    habilitarEdicao('tele-acesso', formatarTelefone);
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
    const containers = [
        { id: 'masc', container: 'mascInput' },
        { id: 'fem', container: 'femInput' },
        { id: 'outro', container: 'outroInput' },
        { id: 'prefiroN', container: 'prefiroNInput' }
    ];

    containers.forEach(item => {
        const container = document.getElementById(item.container);
        if (container) container.style.display = 'none';
    });

    const selecionado = containers.find(item => {
        const radio = document.getElementById(item.id);
        return radio && radio.checked;
    });

    if (selecionado) {
        const container = document.getElementById(selecionado.container);
        if (container) container.style.display = '';
    }
}

// Adicionar listeners aos radios para atualizar visualização
document.querySelectorAll('input[name="genero"]').forEach(radio => {
    radio.addEventListener('change', verificarRadio);
});

// ================================
// Alterar Dados Pessoais
// ================================

function alterarPesso() {
    const camposTexto = ['nome', 'username', 'nasc', 'cpf'].map(id => document.getElementById(id));
    const radios = ['masc', 'fem', 'outro', 'prefiroN'].map(id => document.getElementById(id));
    const containers = ['mascInput', 'femInput', 'outroInput', 'prefiroNInput'].map(id => document.getElementById(id));

    // Validar existência
    if (![...camposTexto, ...radios, ...containers].every(el => el)) {
        console.warn('Um ou mais elementos não encontrados.');
        return;
    }

    // Habilitar campos de texto
    camposTexto.forEach(campo => {
        if (!campo.dataset._saved) {
            campo.dataset._origDisabled = String(campo.disabled);
            campo.dataset._origReadOnly = String(campo.readOnly);
            campo.dataset._origStyle = campo.style.cssText;
            campo.dataset._origClass = campo.className;
            campo.dataset._saved = 'true';
        }
        campo.disabled = false;
        campo.readOnly = false;
        campo.classList.remove('disabled');
    });

    // Habilitar radios
    radios.forEach(radio => {
        radio.disabled = false;
    });

    // Mostrar todos os containers de gênero
    containers.forEach(container => {
        container.style.display = '';
    });

    // Finalizar com Enter
    const finalizar = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();

            // Remover listeners
            [...camposTexto, ...radios].forEach(el => {
                el.removeEventListener('keydown', finalizar);
            });

            // Restaurar campos de texto
            camposTexto.forEach(campo => {
                campo.disabled = campo.dataset._origDisabled === 'true';
                campo.readOnly = campo.dataset._origReadOnly === 'true';
                campo.style.cssText = campo.dataset._origStyle || '';
                campo.className = campo.dataset._origClass || '';

                // Limpar dataset
                delete campo.dataset._saved;
                delete campo.dataset._origDisabled;
                delete campo.dataset._origReadOnly;
                delete campo.dataset._origStyle;
                delete campo.dataset._origClass;
            });

            // Desabilitar radios
            radios.forEach(radio => {
                radio.disabled = true;
            });

            // Atualizar visibilidade dos containers de gênero
            verificarRadio();

            // Salvar perfil
            salvarPerfil();
        }
    };

    [...camposTexto, ...radios].forEach(campo => {
        campo.addEventListener('keydown', finalizar);
    });

    camposTexto[0]?.focus();
}

// ================================
// Salvar Perfil no localStorage
// ================================

function salvarPerfil() {
    // Obter gênero selecionado
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
        nome: document.getElementById('nome')?.value || '',
        email: document.getElementById('email-acesso')?.value || '',
        username: document.getElementById('username')?.value || '',
        tel: document.getElementById('tele-acesso')?.value || '',
        nasc: document.getElementById('nasc')?.value || '',
        // Recuperar senha real (não a exibida)
        senha: document.getElementById('senha')?.dataset.senhaReal || '',
        cpf: document.getElementById('cpf')?.value || '',
        genero: genero
    };

    localStorage.setItem('usuarioPerfil', JSON.stringify(perfil));
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
    atualizarTamanhoInput();
}