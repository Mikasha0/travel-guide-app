const router = require('express').Router();
const db = require("../../client");

const {adminAuth} = require('../../middlewares')

router.get("/", async(req,res,next)=>{
    try {
        const bookings = await db.bookingPlan.findMany();
        return res.json({data: bookings})
    } catch (error) {
        next(error)
    }
})

router.post("/", adminAuth, async(req,res,next)=>{
    try {
        const booking = await db.bookingPlan.create({
            data:{
                name: req.body.name,
                days: Number(req.body.days),
                price: Number(req.body.price)
            }
        })  
        return res.json({message:"Booking Plan Added", data: booking})  
    } catch (error) {
        next(error)
    }
})

router.get("/:id", async(req,res,next)=>{
    try {
        const booking = await db.bookingPlan.findFirst({
            where:{
                id: req.params.id
            }
        })
        return res.json({data: booking});
        
    } catch (error) {
        next(error)
    }
})


router.put("/:id", adminAuth, async(req,res,next)=>{
    try {
        const booking = await db.bookingPlan.update({
            where:{
                id: req.params.id
            },
            data:{
                name: req.body.name,
                days: Number(req.body.days),
                price: Number(req.body.price)
            }
        })  
        return res.json({message:"Booking Plan Updated", data: booking})  
    } catch (error) {
        next(error)
    }
})


router.delete("/:id", adminAuth, async(req,res,next)=>{
    try {
        const booking = await db.bookingPlan.delete({
            where:{
                id: req.params.id
            }
        }) 
        return res.json({message:"Booking Plan Deleted", data: booking})  
    } catch (error) {
        next(error)
    }
})
module.exports = router