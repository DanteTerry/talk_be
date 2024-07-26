let onlineUsers = [];

export default function (socket, io) {
  // User joins or opens the application
  socket.on("join", (userId) => {
    socket.join(userId);

    // Add joined user to online users
    if (!onlineUsers.some((user) => user?.userId === userId)) {
      onlineUsers.push({ userId: userId, socketId: socket.id });
    }

    // Send online users to frontend
    io.emit("get-online-users", onlineUsers);

    // Send socket id
    io.emit("setup-socket", socket.id);
  });

  // Socket disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-online-users", onlineUsers);
    console.log("Client disconnected");
  });

  // Join a conversation room
  socket.on("join-conversation", (conversation) => {
    socket.join(conversation);
  });

  // Send and receive message
  socket.on("send-message", (message) => {
    const conversation = message.conversation;
    if (!conversation.users) return;

    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive-message", message);
    });
  });

  // Typing
  socket.on("typing", (conversation) => {
    socket.in(conversation).emit("typing");
  });

  // Stop typing
  socket.on("stop-typing", (conversation) => {
    socket.in(conversation).emit("stop-typing");
  });

  // Call user
  socket.on("call-user", (data) => {
    const { userToCall, signal, from, name, picture, callType, usersInCall } =
      data;
    const userSocket = onlineUsers.find((user) => user.userId === userToCall);
    io.to(userSocket?.socketId).emit("call-user", {
      signal,
      from,
      name,
      picture,
      callType,
      usersInCall,
    });
  });

  // Toggle video
  socket.on("toggle-video", (data) => {
    const { userId, enabled } = data;
    io.to(userId).emit("toggle-video", { userId, enabled });
  });

  // Toggle audio
  socket.on("toggle-audio", (data) => {
    const { userId, enabled } = data;
    io.to(userId).emit("toggle-audio", { userId, enabled });
  });

  // Answer call
  socket.on("answer-call", (data) => {
    const { to, signal, usersInCall } = data;
    io.to(to).emit("call-accepted", { data: signal, usersInCall });
  });

  // End call
  socket.on("end-call", (data) => {
    const { userId, usersInCall } = data;
    io.to(userId).emit("end-call", usersInCall);
  });
}
