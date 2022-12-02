const router  = require('express').Router();
const {body, validationResult} = require('express-validator')
const db = require('../../client')
const nameRequired = body('name').notEmpty().trim();
const {adminAuth} = require('../../middlewares')


router.get('/', async (req,res,next)=>{
    try{
        const cities = await db.city.findMany({
            where:{
                name:{
                    contains: req.query.name!=null?req.query.name:undefined
                }
            }
        });
        return res.json({data: cities})
    }catch(err){
        next(err)
    }
})

router.get('/:id', async (req,res,next)=>{
    try{
        const city = await db.city.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if(!city) {
            res.status(404)
            next(new Error("City not found"))
        }
        return res.json({data: city})
    }catch(err){
        next(err)
    }
})


router.post('/',adminAuth,nameRequired , async (req,res, next)=>{
    try{
        const city = await db.city.create({
            data:{
                name: req.body.name
            }
        })

        return res.json({data: city, message: "City Created"})

    }catch(err){
        next(err)
    }
})


router.put('/:id', adminAuth,async (req,res, next)=>{
    try{
        const city = await db.city.update({
            where:{
                id: Number(req.params.id)
            },
            data:{
                name: req.body.name
            }
        })

        return res.json({data: city, message: "City Name Updated"})

    }catch(err){
        next(err)
    }
})


router.delete('/:id', adminAuth,async (req,res, next)=>{
    try{
        const city = await db.city.delete({
            where:{
                id: Number(req.params.id)
            },
        })

        return res.json({data: city, message: "City deleted"})

    }catch(err){
        next(err)
    }
})


module.exports = router;