const router  = require('express').Router();
const db = require('../../client')
const {addDays} = require("date-fns")
const {adminAuth} = require('../../middlewares')

router.get('/', async (req,res,next)=>{
    try{
        const {cityId, days} = req.query
        const events = await db.event.findMany({
            where:{
               cityId:(cityId!==null && cityId!==undefined)?Number(cityId):undefined,
               date:{
                   lte: (days!==null && days!==undefined)?addDays(new Date(), Number(days)):undefined,
                   gte:(days!==null && days!==undefined)?new Date():undefined
               }
            },
            include:{
                city: true
            },
            orderBy:{
                date: "desc"
            }
        });
        return res.json({data: events})
       
    }catch(err){
        next(err)
    }
})

router.get('/:id', async (req,res,next)=>{
    try{
        const event = await db.event.findUnique({
            where: {
                id: req.params.id
            }
        });
        if(!event) {
            res.status(404)
            next(new Error("Event not found"))
        }
        return res.json({data: event})
    }catch(err){
        next(err)
    }
})


router.post('/', adminAuth,async (req,res, next)=>{
    try{
        const event = await db.event.create({
            data:{
                title: req.body.title,
                date: new Date(req.body.date),
                cityId: Number(req.body.cityId),
            }
        })

        return res.json({data: event, message: "Event Created"})

    }catch(err){
        next(err)
    }
})


router.put('/:id', adminAuth,async (req,res, next)=>{
    try{
        const event = await db.event.update({
            where:{
                id: req.params.id
            },
            data:{
                title: req.body.title,
                date: new Date(req.body.date),
                cityId: Number(req.body.cityId),
            }
        })

        return res.json({data: event, message: "Event Updated"})

    }catch(err){
        next(err)
    }
})


router.delete('/:id', adminAuth,async (req,res, next)=>{
    try{
        const event = await db.event.delete({
            where:{
                id: req.params.id
            },
        })

        return res.json({data: event, message: "Event deleted"})

    }catch(err){
        next(err)
    }
})


module.exports = router;