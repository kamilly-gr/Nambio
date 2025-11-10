function nextStep(stepNumber) {
    // Validação básica
    if (stepNumber === 2) {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;

        if (!nome || !email) {
            alert('Por favor, preencha todos os campos obrigatórios da primeira etapa.');
            return;
        }
    }

    // Oculta todas as etapas
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'none';

    // Exibe a etapa desejada
    document.getElementById('step' + stepNumber).style.display = 'block';
}

function submitForm() {
    // Valores das informações do cadastro 2
    const cep = document.getElementById('cep').value;
    const endereco = document.getElementById('endereco').value;


    if (!cep || !endereco) {
        alert('Por favor, preencha todos os campos de endereço.');
        return;
    }
}