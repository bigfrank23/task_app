import express from 'express';
import connectDb from './utils/connectDb.js';
import userRouter from './routes/user.route.js'
import profileRouter from './routes/profile.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json())
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(cookieParser())


app.use('/user', userRouter)
app.use('/user', profileRouter)

// app._router.stack.forEach((r) => {
//   if (r.route) {
//     console.log(Object.keys(r.route.methods), r.route.path);
//   }
// });


app.listen(process.env.PORT || 5000, () => {
  connectDb()
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
}
);

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});
