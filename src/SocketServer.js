let onlineUser = [];

export default async function (socket, io) {
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
    if (!conversation?.users) return;

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
      usersInCall: data.usersInCall,
    });
  });

  socket.on("toggle-video", (data) => {
    const userId = data.userId;
    io.to(userId).emit("toggle-video", { userId, enabled: data.enabled });
  });

  socket.on("toggle-audio", (data) => {
    const userId = data.userId;
    io.to(userId).emit("toggle-audio", { userId, enabled: data.enabled });
  });
  // answer call

  socket.on("answer call", (data) => {
    io.to(data.to).emit("call accepted", {
      data: data.signal,
      usersInCall: data.usersInCall,
      userName: data.userName,
      userPicture: data.userPicture,
    });
  });

  // end call
  socket.on("end call", (data) => {
    io.to(data.userId).emit("end call", data.usersInCall);
  });

  // send friend request
  socket.on("send-friend-request", (data) => {
    const { receiver } = data;
    let userSocketId = onlineUser.find((user) => user.userId === receiver);
    io.to(userSocketId?.socketId).emit("receive-friend-request", data);
  });

  // accept friend request
  socket.on("accept-friend-request", (data) => {
    const { friendId } = data;
    let userSocketId = onlineUser.find((user) => user.userId === friendId);
    io.to(userSocketId?.socketId).emit("accepted-friend-request");
  });

  // reject friend request
  socket.on("reject-friend-request", (data) => {
    const { friendId } = data;
    let userSocketId = onlineUser.find((user) => user.userId === friendId);
    io.to(userSocketId?.socketId).emit("rejected-friend-request");
  });
}
