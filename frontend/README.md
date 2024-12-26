# Инструкции по подключению API через WebSocket и HTTP к компонентам

## Описание компонентов

### MessagesPanel
Этот компонент отображает список сообщений в панели чата. Использует WebSocket для получения сообщений в реальном времени и обновления интерфейса.

### InputPanel
Компонент для ввода и отправки сообщений. Отправляет данные на сервер через WebSocket.

### AddChatComponent
Компонент для добавления нового пользователя в чат. Выполняет POST-запрос на сервер через API.

### ChatList
Компонент отображает список чатов. Использует WebSocket для получения списка чатов в реальном времени.

---

## Шаги подключения API

### 1. Запуск WebSocket сервера
Перед использованием компонентов убедитесь, что сервер WebSocket запущен и доступен по адресу `ws://localhost:5000/ws`.

### 2. Настройка WebSocket в компонентах

#### MessagesPanel

1. В файле `MessagesPanel.jsx` создается WebSocket подключение:
   ```javascript
   socket.current = new WebSocket("http://localhost:5000/ws");
   ```

2. WebSocket обрабатывает следующие события:
   - **onopen**: Уведомляет об успешном подключении.
   - **onmessage**: Получает сообщения и обновляет DOM элемент с использованием компонента Message.
   - **onclose** и **onerror**: Обрабатывают закрытие и ошибки подключения.

3. Сообщения классифицируются по ID пользователя (cookies):
   ```javascript
   if (message.userId === Cookies.get('address')) {
       Message.classList.add("user_message");
   } else {
       Message.classList.add("interlocutor_message");
   }
   ```

#### InputPanel

1. В файле `InputPanel.jsx` WebSocket подключается аналогично:
   ```javascript
   socket.current = new WebSocket("http://localhost:5000/ws");
   ```

2. Отправка сообщения реализована через метод `sendMessage`:
   ```javascript
   const sendMessage = () => {
       if (!message.trim()) return;
       if (socket.current && socket.current.readyState === WebSocket.OPEN) {
           socket.current.send(JSON.stringify({
               type: "massage",
               user_id: `${Cookies.get('address')}`,
               text: `${message}`
           }));
           setMessage("");
       }
   };
   ```

#### AddChatComponent

1. В файле `AddChatComponent.jsx` используется метод `fetch` для добавления нового пользователя:
   ```javascript
   const addChat = () => {
       fetch('http://127.0.0.1:5000/addUser', {
           mode: "no-cors",
           method: 'POST',
           body: JSON.stringify({address: addUser}),
       });
   };
   ```

2. Функция `addChat` отправляет POST-запрос с адресом нового пользователя на сервер API.
3. Используется состояние (`useState`) для управления вводом адреса пользователя.

#### ChatList

1. В файле `ChatList.jsx` создается WebSocket подключение:
   ```javascript
   socket.current = new WebSocket("http://localhost:5000/ws");
   ```

2. WebSocket обрабатывает события:
   - **onopen**: Подтверждает установку соединения.
   - **onmessage**: Получает список чатов и обновляет DOM, создавая элементы Chat:
     ```javascript
     socket.current.onmessage = function (event) {
         const data = JSON.parse(event.data);
         if (data.type === "chats") {
             usersDivRef.current.replaceChildren()
             data.chats.forEach(chat => {
                 if (usersDivRef.current) {
                     const chatComponent = React.createElement(Chat, {chat_id: chat.chat_id}, null);
                     usersDivRef.current.appendChild(chatComponent);
                 }
             });
         }
     };
     ```

3. Чаты обновляются в реальном времени с использованием полученных данных.

---

## Примеры API сообщений

### Формат входящих сообщений (для MessagesPanel):
```json
{
  "type": "messages",
  "messages": [
    {"userId": "123", "messageText": "Привет"},
    {"userId": "456", "messageText": "Как дела?"}
  ]
}
```

### Формат исходящих сообщений (для InputPanel):
```json
{
  "type": "massage",
  "user_id": "123",
  "text": "Ваш текст сообщения"
}
```

### Формат запроса для AddChatComponent:
```json
{
  "address": "новый пользователь"
}
```

### Формат входящих данных для ChatList:
```json
{
  "type": "chats",
  "chats": [
    {"chat_id": "123"},
    {"chat_id": "456"}
  ]
}
```

---

## Настройка страниц SignInPage и LogInPage

### SignInPage

1. Компонент `SignInPage` выполняет POST-запрос на сервер для регистрации пользователя.
2. При успешной регистрации в DOM элементы добавляются адрес и секретная фраза пользователя, а также устанавливается cookie.

Пример реализации:
```javascript
const handleRegister = () => {
    fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
    })
        .then((response) => response.json())
        .then((data) => {
            const addressDiv = document.querySelector('#addressDiv');
            addressDiv.textContent = `${data.address}`;
            const secretDiv = document.querySelector('#secretDiv');
            secretDiv.textContent = `${data.mnemonic}`;
            document.cookie = `address=${data.address};max-age=360000;secretPhrase=${data.mnemonic}`;
        });
};
```

### LogInPage

1. Компонент `LogInPage` выполняет POST-запрос для авторизации пользователя через секретную фразу.
2. При успешной авторизации устанавливается cookie и происходит редирект на главную страницу.

Пример реализации:
```javascript
const handleRegister = () => {
    fetch(`http://127.0.0.1/login/${secret}`, {
        method: 'POST',
    })
        .then((response) => response.json())
        .then((data) => {
            document.cookie = `address=${data.address};max-age=360000;secretPhrase=${secret}`;
            window.location.href = '/';
        });
};
```

