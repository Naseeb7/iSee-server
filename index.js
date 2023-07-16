import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import dotenv from "dotenv"

dotenv.config()
const port=process.env.PORT || 6001

const app=express();
app.use(cors())

const server= http.createServer(app);
const io= new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})


io.on("connection", (socket)=>{
    socket.emit("myid", socket.id)
	console.log("Connected socket")

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("receivingCall", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answeredCall", (data) => {
		io.to(data.to).emit("callAccepted", data)
	})
	socket.on("sendImage", (data) => {
		io.to(data.to).emit("receiveImage", data)
	})
	socket.on("messagesent", (data) => {
		io.to(data.to).emit("messagereceived", data)
	})
	socket.on("videoOff", (data) => {
		io.to(data.to).emit("userVideoOff", data.video)
	})
	socket.on("mute", (data) => {
		io.to(data.to).emit("userMute", data.audio)
	})
})

server.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})
app.get("/",(req,res)=>{
    res.send({users})
})