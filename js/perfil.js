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
// NOVA FUNÇÃO GLOBAL PARA EXIBIR FOTOS DA CASA
// ================================

function exibirFotosCasa(fotosBase64) {
    const previewContainer = document.getElementById('previewFotosCasa');
    if (!previewContainer || !fotosBase64 || !Array.isArray(fotosBase64)) return;

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

    fotosBase64.slice(0, 5).forEach((base64, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.cssText = `
            position: relative;
            width: 100px;
            height: 100px;
            margin: 5px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 2px solid #e0e0e0;
        `;
        
        imgWrapper.innerHTML = `
            <img src="${base64}" 
                alt="Foto da casa ${index + 1}" 
                style="width: 100%; height: 100%; object-fit: cover;"
            >
            <div style="
                position: absolute; 
                bottom: 0; 
                left: 0; 
                right: 0; 
                background: rgba(0,0,0,0.5); 
                color: white; 
                padding: 2px;
                text-align: center;
                font-size: 12px;
            ">Foto ${index + 1}</div>
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
        
        // Exibir fotos da casa se existirem
        if (usuario.fotosCasa && usuario.fotosCasa.length > 0) {
            exibirFotosCasa(usuario.fotosCasa);
        } else {
            const previewContainer = document.getElementById('previewFotosCasa');
            if (previewContainer) {
                exibirFotosCasa([]); // Mostrar mensagem de "nenhuma foto"
            }
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

    console.log(`Página de perfil inicializada (${ehHost ? 'Host' : 'Aluno'})`);
}