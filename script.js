async function buyLogo(button) {
  const item = button.parentElement;
  const logoId = parseInt(item.getAttribute('data-id'));
  const userId = 1; // demo user

  const res = await fetch('/.netlify/functions/buyLogo', {
    method: 'POST',
    body: JSON.stringify({ userId, logoId })
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById('balance').innerText = '$' + data.newBalance;
    const historyList = document.getElementById('historyList');
    const li = document.createElement('li');
    li.textContent = `Логотип "${item.getAttribute('data-name')}" — $${item.getAttribute('data-price')}`;
    historyList.appendChild(li);
    alert(data.message);
  } else {
    alert(data.message);
  }
}

function withdraw() {
  const balanceEl = document.getElementById('balance');
  if(balanceEl.innerText !== '$0') {
    alert(`Гроші виведено: ${balanceEl.innerText}`);
    balanceEl.innerText = '$0';
  } else {
    alert('Баланс порожній!');
  }
}
