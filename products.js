
const express=require("express");
const app=express();
const port=3000;
app.use(express.json());
app.use((req,res,next)=>{
    console.log(req.method);
    console.log(req.url);
    next();
})//middleware
console.log("working");
app.get("/",(req,res)=>{
    res.send("Hello Syam");
})

app.get("/about",(req,res)=>{
    res.send("Hello About");
})
app.get("/contact",(req,res)=>{
    res.send("Hello Contact");
})

app.get("/api/hello",(req,res)=>{
    res.json({
       "message":"Hello from server",
        ok:"done"
    })
})
app.get("/products/:id",(req,res)=>{
    const productId=req.params.id;
    res.status(200).json({
        id:productId
    })
})
app.get("/api/users/:id/order/:orderId",(req,res)=>{
   const userId=req.params.id;
   const order=req.params.orderId;
   res.status(200).json({id:userId,orderId:order})
})
app.get("/products",(req,res)=>{
    const query=req.query;
    res.status(200).json({
        category:query.category,
        price:query.price
    })
})
app.post("/api/login",(req,res)=>{
   const email=req.body.email;
   const password=req.body.password;
   res.status(200).json({
    email:email,
    meassage:"login successful"
   })
})
app.get("/api/missing",(req,res)=>{
    res.status(200).json({
        "message":"Not Found",
        ok:"not done"
    })
})

app.listen(port,()=>{
    console.log(`server is running on port http://localhost:${port}`);
})