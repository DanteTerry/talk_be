let onlineUser = [];

export default function (socket, io) {
  // user joins or opens the application
  socket.on("join", (user_id) => {
    socket.join(user_id);

    // add joined user to online users

    if (!onlineUser.some((user) => user?.userId === user_id)) {
      onlineUser.push({ userId: user_id, socketId: socket.id });
    }

    // send online user to frontend
    io.emit("get-online-users", onlineUser);
  });

  //   socket disconnect
  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
    io.emit("get-online-users", onlineUser);
  });

  //   join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  //send and receive message
  socket.on("send message", (message) => {
    const conversation = message.conversation;
    if (!conversation.users) return;

    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });

  //   typing
  socket.on("typing", (conversation) => {
    console.log("typing");
    socket.in(conversation).emit("typing");
  });

  //  stop typing
  socket.on("stop typing", (conversation) => {
    console.log("stop typing");
    socket.in(conversation).emit("stop typing");
  });
}
