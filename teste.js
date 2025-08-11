document.getElementById('sendButton').addEventListener('click', function () {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message) {
    const chatMessages = document.getElementById('chatMessages');
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('message', 'sent'); // Pode ser 'received' também
    newMessageDiv.innerHTML = `<p>${message}</p>`
    chatMessages.appendChild(newMessageDiv);
    input.value = '';
    newMessageDiv.style.textAlign = 'rigth';
    chatMessages.scrollTop = chatMessages.scrollHeight; // Rolar para a última mensagem
  }
});
