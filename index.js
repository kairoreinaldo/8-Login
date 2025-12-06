// Animação dos painéis
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo) {
    const msgAnterior = document.querySelector('.mensagem-feedback');
    if (msgAnterior) msgAnterior.remove();

    const div = document.createElement('div');
    div.className = `mensagem-feedback ${tipo}`;
    div.textContent = mensagem;
    div.style.cssText = `
        padding: 10px 20px;
        margin: 10px 0;
        border-radius: 5px;
        text-align: center;
        font-size: 14px;
        ${tipo === 'sucesso' 
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;

    const form = document.querySelector(`.${tipo === 'sucesso' ? 'sign-in' : 'sign-up'}-container form`);
    form.insertBefore(div, form.firstChild);
    setTimeout(() => div.remove(), 5000);
}

// 📝 REGISTRO (Não mudou quase nada)
const formRegistro = document.querySelector('.sign-up-container form');
const btnRegistrar = document.querySelector('.sign-up-container .btn-grad');

btnRegistrar.addEventListener('click', async (e) => {
    e.preventDefault();
    const nome = formRegistro.querySelector('input[type="text"]').value.trim();
    const email = formRegistro.querySelector('input[type="email"]').value.trim();
    const senha = formRegistro.querySelector('input[type="password"]').value;

    if (!nome || !email || !senha) return mostrarMensagem('Preencha todos os campos!', 'erro');
    if (senha.length < 6) return mostrarMensagem('Senha mínima de 6 caracteres!', 'erro');

    try {
        const response = await fetch('http://localhost:3000/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        const data = await response.json();

        if (data.sucesso) {
            mostrarMensagem(data.mensagem, 'sucesso');
            formRegistro.reset();
            setTimeout(() => container.classList.remove("right-panel-active"), 2000);
        } else {
            mostrarMensagem(data.mensagem, 'erro');
        }
    } catch (error) {
        mostrarMensagem('Erro no servidor!', 'erro');
    }
});

// 🔐 LOGIN (AQUI MUDOU!)
const formLogin = document.querySelector('.sign-in-container form');
const btnLogin = document.querySelector('.sign-in-container .btn-grad');

btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = formLogin.querySelector('input[type="email"]').value.trim();
    const senha = formLogin.querySelector('input[type="password"]').value;

    if (!email || !senha) return mostrarMensagem('Preencha todos os campos!', 'erro');

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();

        if (data.sucesso) {
            mostrarMensagem(data.mensagem, 'sucesso');
            
            // <--- MUDANÇA IMPORTANTE: Salvamos o TOKEN, não o usuário
            localStorage.setItem('token', data.token);
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            mostrarMensagem(data.mensagem, 'erro');
        }
    } catch (error) {
        mostrarMensagem('Erro no servidor!', 'erro');
    }
});