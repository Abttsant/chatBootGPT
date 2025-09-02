let chatHistoric = [];

const formSubmit = document.getElementById('form');
const apikeyInput = document.getElementById('apiKey');
const btn = document.getElementById('sendButton');

let messageInput = document.getElementById('messageInput');
let characterCount = document.getElementById('characterCount');
const cleanButton = document.getElementById('cleanButton');

// Mostra e remove placeholder dinamicamente + CSS
function togglePlaceholder() {
  if (messageInput.innerText.trim() === '') {
    messageInput.classList.remove('not-empty');
  } else {
    messageInput.classList.add('not-empty');
  }
}
messageInput.addEventListener('input', togglePlaceholder);
togglePlaceholder();

// Contagem de caracteres
function counter() {
  const count = messageInput.textContent.length;
  count > 0
    ? (characterCount.textContent = 'Caracteres: ' + count)
    : (characterCount.textContent = '');
}
messageInput.addEventListener('input', counter);

messageInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      return;
    } else {
      event.preventDefault();
      btn.click();
    }
  }
});

function handleError(error) {
  let errorMessage = error.message;

  const errorMap = {
    'Failed to fetch':
      'Não foi possível conectar ao servidor. Verifique sua internet.',
    401: 'Chave de API inválida!',
    429: 'Limite de requisições excedido. Tente novamente mais tarde.',
    404: 'Talvez você não tenha acesso a essa versão do GPT.',
  };

  let userMessage =
    errorMap[errorMessage] ||
    'Ocorreu um erro inesperado. Tente novamente mais tarde.';

  Toastify({
    text: userMessage,
    position: 'center',
    style: {
      background: '#5c55ad',
      color: '#fff',
      fontSize: '16px',
      duration: 3000,
    },
    close: true,
  }).showToast();
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!messageInput.textContent || !apikeyInput.value) {
    btn.style.cursor = 'not-allowed';
    return;
  }

  const loading = document.getElementById('loading');
  loading.style.display = 'inline-block';
  loading.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  btn.disabled = true;
  btn.style.cursor = 'not-allowed';

  let valueMessage = messageInput.textContent.trim();
  chatHistoric.push({ role: 'user', content: valueMessage });
  messageInput.textContent = '';
  togglePlaceholder();
  counter();

  const model = document.getElementById('model').value;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikeyInput.value}`,
      },
      body: JSON.stringify({
        model: model,
        messages: chatHistoric,
      }),
    });
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();

    let res = data.choices[0].message.content;
    chatHistoric.push({ role: 'assistant', content: res });
    showMessage(valueMessage, res);
  } catch (error) {
    handleError(error);
  } finally {
    loading.style.display = 'none';
    btn.disabled = false;
    btn.style.cursor = 'pointer';
  }
}
formSubmit.addEventListener('submit', handleSubmit);

function scrollToBottom() {
  const historic = document.getElementById('historic');
  requestAnimationFrame(() => {
    const last = historic.lastElementChild;
    if (last) last.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });
}
function showMessage(valueMessage, res) {
  const historic = document.getElementById('historic');
  const boxMessage = document.createElement('div');
  boxMessage.className = 'box-my-message';
  const myMessage = document.createElement('p');
  myMessage.className = 'my-message';
  myMessage.innerHTML = valueMessage;
  boxMessage.appendChild(myMessage);
  historic.appendChild(boxMessage);
  historic.scrollTop = historic.scrollHeight;

  const boxResponseMessage = document.createElement('div');
  boxResponseMessage.className = 'box-response-message';
  const chatResponse = document.createElement('p');
  chatResponse.className = 'chat-message';
  const img = document.createElement('div');
  img.innerHTML = `<img src="../assets/logo-chat-zonia.png" alt="">`;
  const copyText = document.createElement('div');

  copyText.innerHTML = `<i class="bi bi-copy copy-button"></i>`;

  chatResponse.innerHTML = res + copyText.innerHTML;
  boxResponseMessage.appendChild(img);
  boxResponseMessage.appendChild(chatResponse);
  historic.appendChild(boxResponseMessage);

  scrollToBottom();
  const btnCopy = chatResponse.querySelector('.copy-button');
  btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(res);
    btnCopy.classList.remove('bi-copy');
    btnCopy.classList.add('bi-check2');
    setTimeout(() => {
      btnCopy.classList.remove('bi-check2');
      btnCopy.classList.add('bi-copy');
    }, 1500);
  });
}

cleanButton.addEventListener('click', () => {
  const modal = document.getElementById('modalClean');
  const close = document.getElementById('close');
  const clean = document.getElementById('clean');

  modal.showModal();
  close.addEventListener('click', () => modal.close());

  clean.addEventListener('click', () => {
    const historic = document.getElementById('historic');

    clean.addEventListener('click', () => {
      modal.close();
      historic.innerHTML = '';
      chatHistoric = [];
    });
  });
});
