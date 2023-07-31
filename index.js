const express = require('express');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' })

const app = express();

app.use(express.static('public'));
app.use(express.static('public/uploads'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
});

app.post('/todo-new',upload.single('pic'),(req,res)=>{
    console.log(req.file);
    const todo ={
        id: Date.now(),
        name: req.body.todoInput,
        completed: false,
        fileName: req.file.filename
    }
    
    saveOneToDo(todo,(err)=>{
        if(err){
            res.status(500).send("Error");
            return;
        }
        res.redirect('/');
    });
})
app.post('/todo',(req,res)=>{
    saveAllToDo(req.body,(err)=>{
        if(err){
            res.status(500);
            return;
        }
        res.status(200).send(req.body);
    });
});

app.get('/todo-data',(req,res)=>{
    readToDo((err,todos)=>{
        if(err){
            res.status(500);
            return;
        }

        res.status(200).json(todos);
    });
});

app.listen(4002,()=>{
    console.log('Server is running at 4002...');
});

//get todo from file
function readToDo(callback){
    fs.readFile("./data.txt","utf-8",(err,todos)=>{
        if(err){
            callback(err);
            return;
        }

        if(todos.length === 0){
            todos = "[]";
        }

        try{
            todos = JSON.parse(todos);
            callback(null,todos);
        }catch(err){
            callback("[]");
        }
    });
}
//write all todo on file
function saveAllToDo(todos,callback){
    fs.writeFile('./data.txt',JSON.stringify(todos),(err)=>{
        if(err){
            callback(err);
            return;
        }
        callback(null);
    })
}

//write single todo on file
function saveOneToDo(todo,callback){
    readToDo((err,todos)=>{
        if(err){
            callback(err);
            return;
        }
        todos.push(todo);
        fs.writeFile('./data.txt',JSON.stringify(todos),(err)=>{
            if(err){
                callback(err);
                return;
            }
            callback(null);
        });
    });
}
