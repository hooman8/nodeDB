const socket = io();
const chatForm = document.querySelector("#chatForm");
const chatInput = chatForm.querySelector("#chat-input");
const chatBox = document.querySelector("#chat");
const userId = "635982500d28a2d9946b786d";
const fullName = "Browser Ahmad";
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("message", {
    content: chatInput.value,
    userId,
    fullName,
  });
  chatInput.value = "";
});

socket.on("message", (message) => {
  const div = document.createElement("div");
  const isCurrentUser = message.user === userId ? "current-user" : "";
  div.classList.add("message", isCurrentUser);
  div.appendChild(document.createTextNode(`${message.user}:`));
  div.appendChild(document.createTextNode(message.content));
  const li = document.createElement("li");
  li.appendChild(div);
  chatBox.appendChild(li);
});
