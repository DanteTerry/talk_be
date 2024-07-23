let onlineUser = [];

export default function (socket, io) {
  // user joins or opens the application
  socket.on("join", (userId) => {
    socket.join(userId);

    // add joined user to online users
    if (!onlineUser.some((user) => user?.userId === userId)) {
      onlineUser.push({ userId: userId, socketId: socket.id });
    }

    // send online user to frontend
    io.emit("get-online-users", onlineUser);

    // send socket id
    io.emit("setup socket", socket.id);
  });

  //   socket disconnect
  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
    io.emit("get-online-users", onlineUser);
    console.log("client disconnected");
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
    socket.in(conversation).emit("typing");
  });

  //  stop typing
  socket.on("stop typing", (conversation) => {
    socket.in(conversation).emit("stop typing");
  });

  // call
  socket.on("call user", (data) => {
    let userId = data.userToCall;
    let userSocketId = onlineUser.find((user) => user.userId === userId);
    io.to(userSocketId?.socketId).emit("call user", {
      signal: data.signal,
      from: data.from,
      name: data.name,
      picture: data.picture,
      callType: data.callType,
    });
  });

  // answer call

  socket.on("answer call", (data) => {
    io.to(data.to).emit("call accepted", data.signal);
  });

  // end call
  socket.on("end call", (id) => {
    io.to(id).emit("end call");
  });
}
