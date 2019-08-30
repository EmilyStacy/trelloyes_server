const express = require('express')
const uuid = require('uuid/v4')
const logger = require('./logger')
const { cards, lists } = require('./store')

const listRouter = express.Router()
const bodyParser = express.json()

listRouter
    .route('/list')
    .get((req,res)=> {
        res.json(lists)
    })
    .post(bodyParser,(req,res)=> {
        const {header, cardIds=[]} =req.body;
        if(!header){
            logger.info(`no header`)
            return res
                .status(400)
                .send('Invalid data');
        }
        if(cardIds.length > 0) {
            let valid = true;
           cardIds.forEach(cid => {
                const card = cards.find(c => c.id == cid);
                if (!card) {
                  logger.error(`Card with id ${cid} not found in cards array.`);
                  valid = false;
                }
            });
                if(!valid){
                    return res
                        .status(400)
                        .send('Invalid data')
                }
            }
                const id = uuid();
                const list = {
                    id,
                    header,
                    cardIds
                };
                lists.push(list);
                logger.info(`List with ID ${id} created`);
                res
                    .status(201)
                    .location(`http://localhost:8000/list/${id}`)
                    .json(id);
        });
listRouter
        .route('/list/:id')
        .get((req,res)=> {
            const {id} = req.params;
            const list = lists.find(list=> list.id == id);
            if(!list) {
                logger.error(`List with ${id} not found`)
                return res
                    .status(404)
                    .send('List not found')
            }
            res.json(list);
        })
        .delete((req,res)=> {
            const {id} =req.params;
            const listIndex = lists.findIndex(li=>li.id == id);
            if(listIndex === -1) {
                logger.error(`List with ${id} not found`);
                return res
                    .status(404)
                    .send('Not found')
            }
            lists.splice(listIndex,1);
            logger.info(`List with ${id} deleted`);
            res
                .status(204)
                .end();
        })

        module.exports=listRouter;