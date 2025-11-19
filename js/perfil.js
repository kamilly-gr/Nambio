document.addEventListener('DOMContentLoaded', function () {
    // 1. Recuperar os dados do localStorage
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

        // Senha: exibir como ••••••, mas guardar a real no dataset
        const senhaInput = document.getElementById('senha');
        if (senhaInput) {
            senhaInput.value = '••••••';
            senhaInput.dataset.senhaReal = usuario.senha || '';
        }

        // Restaurar gênero SE estiver salvo
        if (usuario.genero) {
            const radio = document.getElementById(usuario.genero);
            if (radio) {
                radio.checked = true;
                // Só após carregar um gênero salvo, aplicamos a regra de exibir só ele
                verificarRadio();
            }
        }
        // Se NENHUM gênero estiver salvo, todos permanecem visíveis (comportamento inicial desejado)
    }

    // Configurar listeners para os radios (seleção ativa)
    document.querySelectorAll('input[name="genero"]').forEach(radio => {
        radio.addEventListener('change', () => {
            verificarRadio();
            salvarPerfil(); // salva automaticamente ao escolher gênero
        });
    });
});

// ================================
// Funções de edição genéricas
// ================================

function habilitarEdicao(elementoId, mascaraFn = null) {
    const el = document.getElementById(elementoId);
    if (!el) return;

    if (!el.dataset._saved) {
        el.dataset._origDisabled = String(el.disabled);
        el.dataset._origReadOnly = String(el.readOnly);
        el.dataset._origStyle = el.style.cssText || '';
        el.dataset._origClass = el.className || '';
        el.dataset._saved = 'true';
    }

    el.disabled = false;
    el.readOnly = false;
    el.classList.remove('disabled');
    el.focus();

    if (mascaraFn) {
        el.addEventListener('input', mascaraFn);
    }

    if (el.dataset._enterListenerAttached === 'true') return;

    const finalizar = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();

            if (mascaraFn) {
                el.removeEventListener('input', mascaraFn);
            }

            salvarPerfil();

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

function mudarSenha() { habilitarEdicao('senha'); }
function mudarEmail() { habilitarEdicao('email-acesso'); }
function mudarTele() { habilitarEdicao('tele-acesso', formatarTelefone); }

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
// Gênero: esconde não selecionados APÓS uma escolha
// ================================

function verificarRadio() {
    const itens = [
        { id: 'masc', container: 'mascInput' },
        { id: 'fem', container: 'femInput' },
        { id: 'outro', container: 'outroInput' },
        { id: 'prefiroN', container: 'prefiroNInput' }
    ];

    // Encontrar o selecionado
    const selecionado = itens.find(item => {
        const radio = document.getElementById(item.id);
        return radio && radio.checked;
    });

    // Esconder todos se houver uma seleção
    if (selecionado) {
        itens.forEach(item => {
            const container = document.getElementById(item.container);
            if (container) {
                container.style.display = (item.id === selecionado.id) ? '' : 'none';
            }
        });
    }
    // Se nenhum estiver selecionado, deixa todos visíveis (não fazemos nada aqui)
}

// ================================
// Alterar Dados Pessoais
// ================================

function alterarPesso() {
    const camposTexto = ['nome', 'username', 'nasc', 'cpf'].map(id => document.getElementById(id));
    const radios = ['masc', 'fem', 'outro', 'prefiroN'].map(id => document.getElementById(id));
    const containers = ['mascInput', 'femInput', 'outroInput', 'prefiroNInput'].map(id => document.getElementById(id));

    if (![...camposTexto, ...radios, ...containers].every(el => el)) {
        console.warn('Um ou mais elementos não encontrados.');
        return;
    }

    // Habilitar campos
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

    radios.forEach(radio => {
        radio.disabled = false;
    });

    // Mostrar TODOS os containers de gênero (para permitir troca)
    containers.forEach(container => {
        if (container) container.style.display = '';
    });

    // Finalizar com Enter
    const finalizar = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();

            [...camposTexto, ...radios].forEach(el => {
                el.removeEventListener('keydown', finalizar);
            });

            // Restaurar campos de texto
            camposTexto.forEach(campo => {
                campo.disabled = campo.dataset._origDisabled === 'true';
                campo.readOnly = campo.dataset._origReadOnly === 'true';
                campo.style.cssText = campo.dataset._origStyle || '';
                campo.className = campo.dataset._origClass || '';

                delete campo.dataset._saved;
                delete campo.dataset._origDisabled;
                delete campo.dataset._origReadOnly;
                delete campo.dataset._origStyle;
                delete campo.dataset._origClass;
            });

            radios.forEach(radio => {
                radio.disabled = true;
            });

            // Após salvar, aplica a regra: só o selecionado fica visível
            verificarRadio();

            salvarPerfil();
        }
    };

    [...camposTexto, ...radios].forEach(campo => {
        campo.addEventListener('keydown', finalizar);
    });

    camposTexto[0]?.focus();
}

// ================================
// Salvar Perfil
// ================================

function salvarPerfil() {
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
        senha: document.getElementById('senha')?.dataset.senhaReal || '',
        cpf: document.getElementById('cpf')?.value || '',
        genero: genero
    };

    localStorage.setItem('usuarioPerfil', JSON.stringify(perfil));
}

// ================================
// Ajuste do tamanho do input de senha
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