require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet =require('helmet');
const {NODE_ENV} = require('./config');
const app = express();
// const uuid = require('uuid/v4');
const morganOption = (NODE_ENV === 'production')?'tiny':'common';
// const winston = require('winston');
const logger = require('./logger');
const cardRouter = require('./cardRouter');
const listRouter=require('./listRouter');
// const {cards,lists}=require('./store');
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
// app.use(express.json());
app.use(function validateBearerToken(req,res,next){

const apiToken = process.env.API_TOKEN;
const authToken = req.get('Authorization');
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path:${req.path}`)
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next();
})
app.use(cardRouter);
app.use(listRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!')
  })
// const logger = winston.createLogger(
//     {
//         level:'info',
//         format:winston.format.json(),
//         transports:[
//             new winston.transports.File({filename:'info.log'})   
//         ]
//     }
// );
// if (NODE_ENV !=='production'){
//     logger.add(new winston.transports.Console({format:winston.format.simple()}));
// }
// const cards = [{
//     id:1,
//     title: 'Task one',
//     content:'This is Card One'
// }];
// const lists = [{
//     id:1,
//     header:'List One',
//     cardIds:[1]
// }];

// app.get('/cards',(req,res)=> {
//     res.json(cards)
// })
// app.get('/list',(req,res)=> {
//     res.json(lists)
// })

// app.get('/card/:id', (req,res)=> {
//     const {id} = req.params;
//     const card = cards.find(card => card.id == id)

//     if(!card) {
//         logger.error(`Card with ${id} not found`)
//         return res  
//             .status(404)
//             .send('Card not found')
//     }
//     res.json(card);
// })
// app.get('/list/:id',(req,res)=> {
//     const {id} = req.params;
//     const list = lists.find(list=> list.id == id);
//     if(!list) {
//         logger.error(`List with ${id} not found`)
//         return res
//             .status(404)
//             .send('List not found')
//     }
//     res.json(list);
// })
// app.post('/cards',(req,res)=> {
//     const {title,content} = req.body;
//     if(!title) {
//         logger.error('no title');
//         return res
//             .status(400)
//             .send('Invalid data')
//     }
//     if(!content) {
//         logger.error('no content');
//         return res
//             .status(400)
//             .send('Invalid data')
//     }
//     const id = uuid();
//     const card = {
//         id,
//         title,
//         content
//     };
//     cards.push(card);
//     logger.info(`Card with id ${id} created`);
//     res
//         .status(201)
//         .location(`http://localhost:8000/card/${id}`)
//         .json(card)
// })
// app.post('/list',(req,res)=> {
//     const {header, cardIds=[]} =req.body;
//     if(!header){
//         logger.info(`no header`)
//         return res
//             .status(400)
//             .send('Invalid data');
//     }
//     if(cardIds.length > 0) {
//         let valid = true;
//        cardIds.forEach(cid => {
//             const card = cards.find(c => c.id == cid);
//             if (!card) {
//               logger.error(`Card with id ${cid} not found in cards array.`);
//               valid = false;
//             }
//         });
//             if(!valid){
//                 return res
//                     .status(400)
//                     .send('Invalid data')
//             }
//         }
//             const id = uuid();
//             const list = {
//                 id,
//                 header,
//                 cardIds
//             };
//             lists.push(list);
//             logger.info(`List with ID ${id} created`);
//             res
//                 .status(201)
//                 .location(`http://localhost:8000/list/${id}`)
//                 .json(id);
//     }
// )
// app.delete('/list/:id',(req,res)=> {
//     const {id} =req.params;
//     const listIndex = lists.findIndex(li=>li.id == id);
//     if(listIndex === -1) {
//         logger.error(`List with ${id} not found`);
//         return res
//             .status(404)
//             .send('Not found')
//     }
//     lists.splice(listIndex,1);
//     logger.info(`List with ${id} deleted`);
//     res
//         .status(204)
//         .end();
// })

// app.delete('/card/:id',(req,res)=> {
//     const {id} = req.params;
//     const cardIndex = cards.findIndex(c => c.id == id);
//     if(cardIndex === -1) {
//         logger.error(`Card with id ${id} not exist`);
//         return res
//             .status(404)
//             .send('Not found')
//     }
//     lists.forEach(list => {
//         const CardIds = list.cardIds.filter(cid => cid !==id);
//         list.cardIds = CardIds;
//     })
//     cards.splice(cardIndex,1);
//     logger.info(`Card with id ${id} deleted`);
//     res
//         .status(204)
//         .end();
// })
app.use(function errorHandler(error,req,res,next) {
    let response;
    if(NODE_ENV === 'production') {
        response = {error: {message:'server error'}}
    }else {
        console.error(error);
        response = {message:error.message, error}
    }
    res.status(500).json(response);
})

module.exports = app;