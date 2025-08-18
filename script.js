const formSubmit = document.getElementById('form');
const apikeyInput = document.getElementById('apiKey');
const btn = document.getElementById('sendButton');
let messageInput = document.getElementById('messageInput');

function handleError(error) {
  console.error('Erro técnico:', error);
  let errorMessage = error.message;

  const errorMap = {
    'Failed to fetch':
      'Não foi possível conectar ao servidor. Verifique sua internet.',
    401: 'Chave de API inválida!',
    429: 'Limite de requisições excedido. Tente novamente mais tarde.',
  };

  let userMessage =
    errorMap[errorMessage] ||
    'Ocorreu um erro inesperado. Tente novamente mais tarde.';

  Toastify({
    text: userMessage,
    position: 'center',
    style: {
      background: 'rgb(55, 145, 247)',
      color: '#fff',
      fontSize: '16px',
      duration: 3000,
    },
    close: true,
  }).showToast();
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!messageInput.value || !apikeyInput.value) {
    btn.style.cursor = 'not-allowed';
    return;
  }

  const loading = document.getElementById('loading');
  loading.style.display = 'inline-block';
  loading.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  btn.disabled = true;
  btn.style.cursor = 'not-allowed';

  let valueMessage = messageInput.value.trim();
  messageInput.value = '';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikeyInput.value}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: valueMessage }],
      }),
    });
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();

    let res = data.choices[0].message.content;
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
function showMessage(valueMessage, response) {
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
  img.innerHTML = `<img src="./assets/logo-chat-zonia.png" alt="">`;
  chatResponse.innerHTML = response;
  boxResponseMessage.appendChild(img);
  boxResponseMessage.appendChild(chatResponse);
  historic.appendChild(boxResponseMessage);

  scrollToBottom();
}
