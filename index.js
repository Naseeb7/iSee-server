import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"

const app=express();
app.use(cors())

const server= http.createServer(app);
const io= new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})

const users=new Map()

io.on("connection", (socket)=>{
    socket.emit("me", socket.id)
    users.set(socket, socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

app.listen(3001,()=>{
    console.log("Server running on port 3001")
})
app.get("/",(req,res)=>{
    res.send({users})
})