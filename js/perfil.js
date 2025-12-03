// ================================
// FUNÇÕES GLOBAIS (acessíveis via HTML)
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

    // Coletar gênero
    let genero = '';
    ['masc', 'fem', 'outro', 'prefiroN'].forEach(id => {
        const radio = document.getElementById(id);
        if (radio?.checked) genero = id;
    });

    // Dados comuns
    const perfil = {
        nome: document.getElementById('nome')?.value.trim() || '',
        email: document.getElementById('email-acesso')?.value.trim() || '',
        tel: document.getElementById('tele-acesso')?.value.trim() || '',
        nasc: document.getElementById('nasc')?.value || '',
        senha: document.getElementById('senha')?.dataset.senhaReal || '',
        cpf: document.getElementById('cpf')?.value.trim() || '',
        genero: genero
    };

    // Dados específicos de host
    if (ehHost) {
        perfil.quantComodos = document.getElementById('quantComodos')?.value.trim() || '';
        perfil.rendaFam = document.getElementById('rendaFam')?.value.trim() || '';
        perfil.tipoImovel = document.getElementById('tipoImovel')?.value.trim() || '';
        perfil.falesobreVc = document.getElementById('falesobreVc')?.value.trim() || '';
        perfil.estadoCivil = document.getElementById('estadoCiv')?.value.trim() || '';

        // Lidar com fotos da casa
        const fotosTemp = localStorage.getItem('fotosCasaTemp');
        const dadosExistentes = localStorage.getItem(chave);
        let fotosExistentes = [];

        if (dadosExistentes) {
            const usuarioExistente = JSON.parse(dadosExistentes);
            fotosExistentes = usuarioExistente.fotosCasa || [];
        }

        // Usar novas fotos se existirem, senão manter as existentes
        perfil.fotosCasa = fotosTemp ? JSON.parse(fotosTemp) : fotosExistentes;

        // Limpar o armazenamento temporário
        localStorage.removeItem('fotosCasaTemp');
    }

    localStorage.setItem(chave, JSON.stringify(perfil));
    aplicarModoVisualizacao();

    // Recarregar as fotos após salvar (só se for host)
    if (ehHost) {
        setTimeout(() => {
            const previewContainer = document.getElementById('previewFotosCasa');
            if (previewContainer && perfil.fotosCasa) {
                exibirFotosCasa(perfil.fotosCasa);
            }
        }, 100);
    }

    console.log(`Perfil salvo em "${chave}" com sucesso!`);
}

function fazerLogout() {
    // Primeiro remove os dados
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioPerfil');
    localStorage.removeItem('usuarioPerfilHost');

    // Depois atualiza o header
    if (typeof verificarEstadoLogin === 'function') {
        verificarEstadoLogin();
    }

    window.location.href = 'loginAluno.html';
}

function mostrarPopupNovaSenha() {
    const overlay = document.getElementById('popup-nova-senha-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        ['antigaSenha', 'novaSenha', 'confirmNovaSenha'].forEach(id => {
            document.getElementById(id).value = '';
        });
    }
}

function fecharPopupNovaSenha() {
    const overlay = document.getElementById('popup-nova-senha-overlay');
    if (overlay) overlay.style.display = 'none';
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

    const ehHost = window.location.pathname.includes('perfilHost.html');
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

// ================================
// FUNÇÃO ATUALIZADA: exibirFotosCasa
// ================================
function exibirFotosCasa(fotosBase64) {
    const previewContainer = document.getElementById('previewFotosCasa');
    if (!previewContainer || !Array.isArray(fotosBase64)) return;

    // Limpa o container
    previewContainer.innerHTML = '';

    if (fotosBase64.length === 0) {
        previewContainer.innerHTML = `
            <div style="
                color: #666; 
                font-style: italic; 
                padding: 15px;
                text-align: center;
                width: 100%;
                border: 1px dashed #ddd;
                border-radius: 8px;
                background: #f9f9f9;
            ">Nenhuma foto cadastrada ainda</div>
        `;
        return;
    }

    // Garante que o array em memória esteja sincronizado
    window.fotosAtuais = [...fotosBase64];

    // Cria os previews
    fotosBase64.slice(0, 5).forEach((base64, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('image-wrapper');
        imgWrapper.dataset.index = index; // Para identificar qual foto remover

        imgWrapper.innerHTML = `
            <img src="${base64}" 
                 alt="Foto da casa ${index + 1}" 
                 class="img-casas-salva">
            
            <button type="button" class="trash-icon" title="Excluir foto">
                <img src="/Nambio/assets/icons/trash.svg" alt="Excluir" style="width:16px;height:16px;">
            </button>
            
            <div class="image-footer">Foto ${index + 1}</div>
        `;

        previewContainer.appendChild(imgWrapper);
    });
}

// ================================
// FUNÇÕES AUXILIARES (SEM ALTERAÇÃO)
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
    const ehHost = window.location.pathname.includes('perfilHost.html');
    const idsComuns = ['nome', 'nasc', 'cpf', 'email-acesso', 'tele-acesso', 'senha'];
    const idsHost = ['quantComodos', 'rendaFam', 'tipoImovel', 'falesobreVc', 'estadoCiv'];

    const idsTodos = ehHost ? [...idsComuns, ...idsHost] : idsComuns;

    // Processar campos
    idsTodos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.disabled = true;
            campo.readOnly = true;
            campo.classList.add('disabled');
        }
    });

    // Processar rádios de gênero
    ['masc', 'fem', 'outro', 'prefiroN'].forEach(id => {
        const radio = document.getElementById(id);
        if (radio) radio.disabled = true;
    });

    verificarRadio();
}

function aplicarModoEdicao() {
    const ehHost = window.location.pathname.includes('perfilHost.html');
    const idsComuns = ['nome', 'nasc', 'cpf', 'email-acesso', 'tele-acesso', 'senha'];
    const idsHost = ['quantComodos', 'rendaFam', 'tipoImovel', 'falesobreVc', 'estadoCiv'];

    const idsTodos = ehHost ? [...idsComuns, ...idsHost] : idsComuns;

    // Habilitar campos
    idsTodos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.disabled = false;
            campo.readOnly = false;
            campo.classList.remove('disabled');
        }
    });

    // Habilitar rádios
    ['masc', 'fem', 'outro', 'prefiroN'].forEach(id => {
        const radio = document.getElementById(id);
        if (radio) radio.disabled = false;
    });

    // Mostrar containers de gênero
    ['mascInput', 'femInput', 'outroInput', 'prefiroNInput'].forEach(id => {
        const container = document.getElementById(id);
        if (container) container.style.display = '';
    });

    // Focar no primeiro campo
    document.getElementById('nome')?.focus();
}

function formatarTelefone(event) {
    let input = event.target;
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 0) valor = `(${valor}`;
    if (valor.length > 3) valor = `${valor.slice(0, 3)}) ${valor.slice(3)}`;
    if (valor.length > 10) valor = `${valor.slice(0, 10)}-${valor.slice(10, 15)}`;

    input.value = valor;
}

function verificarRadio() {
    const itens = [
        { id: 'masc', container: 'mascInput' },
        { id: 'fem', container: 'femInput' },
        { id: 'outro', container: 'outroInput' },
        { id: 'prefiroN', container: 'prefiroNInput' }
    ];

    // Detectar se está no modo visualização através do campo 'nome' estar desabilitado
    const modoVisualizacao = document.getElementById('nome')?.disabled === true;

    if (modoVisualizacao) {
        // No modo visualização: MOSTRAR TODOS OS CONTAINERS
        itens.forEach(item => {
            const container = document.getElementById(item.container);
            if (container) {
                container.style.display = ''; // Mostra todos
            }
        });
        return; // Para aqui, não executa a lógica de edição
    }

    // ---- LÓGICA ORIGINAL (SÓ PARA MODO EDIÇÃO) ----
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

function carregarFotoSalva() {
    const img = document.getElementById('imgPerfilHeader');
    const fotoSalva = localStorage.getItem('fotoPerfilURL');

    if (img && fotoSalva) {
        img.src = fotoSalva;
        img.classList.remove('icone-padrao');
        img.classList.add('foto-usuario-customizada');
    }
}

// ================================
// INICIALIZAÇÃO CONDICIONAL
// ================================

document.addEventListener('DOMContentLoaded', function () {
    const caminho = window.location.pathname;
    const ehPaginaPerfil = caminho.includes('perfil.html') || caminho.includes('perfilHost.html');

    if (!ehPaginaPerfil) {
        console.log('perfil.js: não inicializado - não é página de perfil');
        return;
    }

    const ehHost = caminho.includes('perfilHost.html');
    const chave = ehHost ? 'usuarioPerfilHost' : 'usuarioPerfil';
    const dados = localStorage.getItem(chave);

    if (dados) {
        const usuario = JSON.parse(dados);
        carregarDados(usuario, ehHost);
    }

    inicializarPagina(ehHost);
});

function carregarDados(usuario, ehHost) {
    const setValor = (id, valor) => {
        const el = document.getElementById(id);
        if (el) el.value = valor || '';
    };

    // Dados comuns
    setValor('nome', usuario.nome);
    setValor('email-acesso', usuario.email);
    setValor('tele-acesso', usuario.tel);
    setValor('nasc', usuario.nasc);
    setValor('cpf', usuario.cpf);

    // Senha
    const senhaInput = document.getElementById('senha');
    if (senhaInput) {
        senhaInput.value = '••••••';
        senhaInput.dataset.senhaReal = usuario.senha || '';
    }

    // Gênero
    if (usuario.genero) {
        const radio = document.getElementById(usuario.genero);
        if (radio) radio.checked = true;
    }

    // Dados específicos de host
    if (ehHost) {
        setValor('quantComodos', usuario.quantComodos);
        setValor('rendaFam', usuario.rendaFam);
        setValor('tipoImovel', usuario.tipoImovel);
        setValor('falesobreVc', usuario.falesobreVc);
        setValor('estadoCiv', usuario.estadoCivil);

        // Sincroniza fotos em memória
        window.fotosAtuais = usuario.fotosCasa || [];

        // Exibe previews
        const previewContainer = document.getElementById('previewFotosCasa');
        if (previewContainer) {
            exibirFotosCasa(window.fotosAtuais);
        }
    }
}

function inicializarPagina(ehHost) {
    aplicarModoVisualizacao();

    // Listeners de gênero
    document.querySelectorAll('input[name="genero"]').forEach(radio => {
        radio.addEventListener('change', verificarRadio);
    });

    // Ajuste dinâmico do campo de senha
    const senhaInput = document.getElementById('senha');
    if (senhaInput) {
        const atualizarTamanho = () => {
            senhaInput.size = Math.max(6, senhaInput.value.length + 1);
        };

        senhaInput.addEventListener('input', atualizarTamanho);
        atualizarTamanho();
    }

    // Foto de perfil
    carregarFotoSalva();

    // Limites de dígitos (só em perfil de host)
    if (ehHost) {
        const limiteDigitos = (id, max) => {
            const campo = document.getElementById(id);
            if (!campo) return;

            campo.addEventListener('input', function () {
                let valor = this.value.replace(/\D/g, '');
                if (valor.length > max) valor = valor.slice(0, max);
                this.value = valor ? parseInt(valor, 10) : '';
            });
        };

        limiteDigitos('quantComodos', 2);
        limiteDigitos('rendaFam', 6);
    }

    // Listener único para exclusão (event delegation)
    document.getElementById('previewFotosCasa')?.addEventListener('click', function (e) {
        const trashBtn = e.target.closest('.trash-icon');
        if (!trashBtn) return;

        const wrapper = trashBtn.closest('.image-wrapper');
        const index = parseInt(wrapper.dataset.index, 10);

        if (window.fotosAtuais && index >= 0 && index < window.fotosAtuais.length) {
            // Remove do array em memória
            const removida = window.fotosAtuais.splice(index, 1)[0];
            console.log('Foto removida:', removida);

            // Atualiza índices dos wrappers seguintes
            Array.from(wrapper.parentElement.children)
                .filter(el => el.classList.contains('image-wrapper') &&
                    parseInt(el.dataset.index, 10) > index)
                .forEach(el => {
                    el.dataset.index = parseInt(el.dataset.index, 10) - 1;
                });

            // Remove do DOM
            wrapper.remove();

            // Salva temporariamente
            localStorage.setItem('fotosCasaTemp', JSON.stringify(window.fotosAtuais));
            console.log('fotosCasaTemp atualizado com', window.fotosAtuais.length, 'fotos.');
        }
    });

    console.log(`Página de perfil inicializada (${ehHost ? 'Host' : 'Aluno'})`);
}

function configurarAdicaoDeFotos() {
    // Referências aos elementos
    const btnAtivaInput = document.getElementById('btn-add-fotos');
    const inputImagem = document.getElementById('add-fotos-casa-perfil');
    const previewContainer = document.getElementById('previewFotosCasa');

    // 1. Ouvinte de evento para o botão customizado abrir o input de arquivo
    btnAtivaInput.addEventListener('click', function () {
        inputImagem.click();
    });

    // 2. Ouvinte de evento para quando o usuário seleciona arquivos
    inputImagem.addEventListener('change', function (event) {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    // Passa o arquivo e o container para a função auxiliar
                    criarPreviewDaImagem(file, previewContainer);
                }
            }
        }
        // Limpa o input para permitir selecionar o mesmo arquivo novamente, se necessário
        inputImagem.value = '';
    });
}

/**
 * Cria um elemento de preview para um arquivo de imagem específico usando innerHTML.
 * @param {File} file O objeto File da imagem.
 * @param {HTMLElement} previewContainer A div onde o preview será inserido.
 */
// A função principal para criar e gerenciar previews
function criarPreviewDaImagem(file, previewContainer) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const base64 = e.target.result;
        const index = previewContainer.children.length;

        // 1. Cria o wrapper que o CSS espera (classe image-wrapper)
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('image-wrapper');

        // 2. Insere a imagem, o botão de lixeira e o rodapé
        imgWrapper.innerHTML = `
            <img src="${base64}" 
                 alt="Foto da casa ${index + 1}" 
                 class="img-casas-salva">
            
            <button class="trash-icon" type="button" title="Excluir foto">
                 🗑️
            </button>
            
            <div class="image-footer">
                Foto ${index + 1}
            </div>
        `;

        // 3. ENCONTRA o ícone de lixeira ESPECÍFICO que acabamos de criar
        const trashIcon = imgWrapper.querySelector('.trash-icon');

        // 4. Adiciona o listener de clique AO ÍCONE DE LIXEIRA
        trashIcon.addEventListener('click', function (event) {
            event.stopPropagation(); // Impede outros comportamentos indesejados

            // Remove o elemento pai inteiro (o imgWrapper) do DOM
            imgWrapper.remove();
            console.log("Imagem removida.");
        });

        // 5. Adiciona o novo preview ao container principal
        previewContainer.appendChild(imgWrapper);
    };

    reader.readAsDataURL(file);
}


// Função de Inicialização: Configura o input de arquivo e o botão
function configurarAdicaoDeFotos() {
    const fileInput = document.getElementById('add-fotos-casa-perfil'); // ID do input oculto
    const addButton = document.getElementById('btn-add-fotos');         // ID do botão visível
    const previewContainer = document.getElementById('previewFotosCasa');

    // Quando o botão visível é clicado, disparamos o clique no input de arquivo oculto
    addButton.addEventListener('click', function () {
        fileInput.click();
    });

    // Listener para o evento 'change' (quando arquivos são selecionados no input oculto)
    fileInput.addEventListener('change', function (event) {
        const files = event.target.files;
        if (files) {
            // Itera sobre todos os arquivos selecionados
            Array.from(files).forEach(file => {
                criarPreviewDaImagem(file, previewContainer);
            });
            // Limpa o input para que o mesmo arquivo possa ser selecionado novamente, se necessário
            event.target.value = '';
        }
    });
}

// INICIALIZAÇÃO: Chama a função de configuração quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', configurarAdicaoDeFotos);