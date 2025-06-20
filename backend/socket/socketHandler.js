const jwt = require('jsonwebtoken');
const User = require('../models/User');

const connectedUsers = new Map(); 

function socketHandler(io) {
  io.on('connection', async (socket) => {
    
    const token = socket.handshake.query && socket.handshake.query.token;
    if (!token) {
      socket.disconnect();
      return;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        socket.disconnect();
        return;
      }
      
      socket.join(user._id.toString());
      connectedUsers.set(user._id.toString(), socket.id);
      
      socket.emit('connected', { message: 'Socket connected', userId: user._id });
      
      socket.on('disconnect', () => {
        connectedUsers.delete(user._id.toString());
      });
    } catch (err) {
      socket.disconnect();
    }
  });
}


function emitEarningNotification(io, userId, data) {
  io.to(userId.toString()).emit('earning', data);
}

module.exports = {
  socketHandler,
  emitEarningNotification
}; 