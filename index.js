import express from "express"
import cors from "cors"

const app=express();
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Hello from server")
})

app.listen(3001,()=>{
    console.log("Server live at 3001")
})