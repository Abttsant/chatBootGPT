

const formSubmit = document.getElementById('form');
const apikeyInput = document.getElementById('apiKey');
const btn = document.getElementById('sendButton');

// document.getElementById('sendButton')
function handleSubmit(event) {
  event.preventDefault();
  let messageInput = document.getElementById('messageInput');

  if (!messageInput.value) {
    btn.style.cursor = 'not-allowed';
    return;
  }
  const status = document.getElementById('status');
  status.style.display = 'block';
  status.innerHTML = 'Carregando...';
  btn.disabled = true;
  btn.style.cursor = 'not-allowed';
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apikeyInput.value}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: messageInput.value }],
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      let res = response.choices[0].message.content;
      status.style.display = 'none';
      showMessage(messageInput, res);
      console.log(res)
    })
    .catch((error) => {
      console.log('Erro:', error);
    }).finally(() => {
      btn.disabled = false;
      btn.style.cursor = 'pointer';
      messageInput.value = '';
    })

  }
formSubmit.addEventListener('submit', handleSubmit);

function showMessage(messageInput, response) {
  const historic = document.getElementById('historic');
  const boxMessage = document.createElement('div');
  boxMessage.className = 'box-my-message';
  const myMessage = document.createElement('p');
  myMessage.className = 'my-message';
  myMessage.innerHTML = messageInput.value;
  boxMessage.appendChild(myMessage);
  historic.appendChild(boxMessage);

  // Respostas do ZooIA
  const boxResponseMessage = document.createElement('div');
  boxResponseMessage.className = 'box-response-message';
  const chatResponse = document.createElement('p');
  chatResponse.className = 'chat-message';
  const img = document.createElement('div');

  img.innerHTML = `<img src="./assets/image.png" alt="">`;
  chatResponse.innerHTML = response;
  // chatResponse.innerHTML = response;
  boxResponseMessage.appendChild(img);
  boxResponseMessage.appendChild(chatResponse);
  historic.appendChild(boxResponseMessage);
}
historic.scrollTop = historic.scrollHeight; // Rolar para a última mensagem

