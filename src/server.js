const express = require('express')
const compression = require("compression");
const helmet = require("helmet");
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./database/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')
dotenv.config()
connectDB()
const app = express()
app.use(compression()); // Compress all routes

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
      },
    }),
  );

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

app.use(
    cors({
        origin: 'http://localhost:3000', // Replace with the origin of your client
        credentials: true, // Enable credentials (cookies, Authorization headers, etc.)
    })
)
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API Running!");
});
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)
// const NODE_ENV= process.env.NODE_ENV  
var PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Server is running successfully on Port ${PORT}...`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    },
})

io.on('connection', (socket) => {
    console.log('Connected to socket.io')

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('User joined Room: ' + room)
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat

        if (!chat.users) return console.log('chat.users not defined')

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return

            socket.in(user._id).emit('message recieved', newMessageRecieved)
        })
    })
})
