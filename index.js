const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const cors = require('cors');
dotenv.config();



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());



app.get('/',() => {
    resizeBy.send("Welcome to my form")
})

app.post('/api/form',(req,res) => {
    let data = req.body
    let smtpTransport = nodemailer.createTransport({
        service:"Gmail",
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        }
    });

    let mailOptions = {
        from: data.email,
        to:process.env.SMTP_MAIL_TO,
        subject:`Message from ${data.name}`,
        html:`
        <table border="1" style="border-collapse: collapse; width: 100%;>
        <tr>
            <th style="padding: 8px; text-align: left;">Name</th>
            <td style="padding: 8px;">${data.name}</td>
        </tr>
        <tr>
            <th style="padding: 8px; text-align: left;">Email</th>
            <td style="padding: 8px;">${data.email}</td>
        </tr>
        <tr>
            <th style="padding: 8px; text-align: left;">Message</th>
            <td style="padding: 8px;">${data.message}</td>
        </tr>
    </table>
        `
    }

    smtpTransport.sendMail(mailOptions, (error,response) => {
        if(error){
            res.status(500).send(error.toString());
        }else{
            req.status(200).sent('Email sent successfully')
        }
    })
    smtpTransport.close();
})


const PORT = process.env.PORT || 3001;
app.listen(PORT,() => {
    console.log(`Server Starting at ${PORT}`);
})