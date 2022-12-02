const router = require('express').Router();
const db = require("../../client");
const axios = require('axios').default
const {userAuth, adminAuth, guideAuth} = require('../../middlewares')

router.get("/", adminAuth,async(req,res,next)=>{
    try {
        const bookings = await db.booking.findMany({
            orderBy:{
                date:"desc"
            },
            include:{
                city: true,
                plan: true,
                guide: true,
                user: true
            },
        })
        res.json({data: bookings});
    } catch (error) {
        next(error)
    }
})

router.get("/personal", userAuth,async(req,res,next)=>{
    try {
        const bookings = await db.booking.findMany({
            orderBy:{
                date:"desc"
            },
            include:{
                city: true,
                plan: true,
                guide: true
            },
            where:{
                userId: Number(req.user.id)
            }
        })
        res.json({data: bookings});
    } catch (error) {
        next(error)
    }
})

router.get("/guide", guideAuth,async(req,res,next)=>{
    try {
        const bookings = await db.booking.findMany({
            orderBy:{
                date:"desc"
            },
            include:{
                city: true,
                plan: true,
                user: true
            },
            where:{
                guideId: Number(req.user.id)
            }
        })
        res.json({data: bookings});
    } catch (error) {
        next(error)
    }
})

router.get("/:id",adminAuth ,async(req,res,next)=>{
    try {
        const booking = await db.booking.findFirst({
            where:{
                id: req.params.id
            }
        })
        res.json({data: booking});
    } catch (error) {
        next(error)
    }
})

router.put("/:id", adminAuth ,async(req,res,next)=>{
    try {
        const booking = await db.booking.update({
            where:{
                id: Number(req.params.id)
            },
            data:{
                guideId: Number(req.body.guideId)
            }
        })
        res.json({data: booking});
    } catch (error) {
        next(error)
    }
})



router.post("/",userAuth, async(req,res,next)=>{
    try{
        const {token, bookingPlanId, date, cityId} = req.body;
        const bookingPlan = await db.bookingPlan.findFirst({
            where: {
                id: bookingPlanId
            }
        })
        const data = {
            token: token,
            amount: bookingPlan.price * 100
        }

        const config = {
            headers: {'Authorization': `Key ${process.env.KHALTI_KEY}`}
        };
        const response = await axios.post("https://khalti.com/api/v2/payment/verify/",
            data,
            config
        )
        if(response.status>=200 && response.status<300){
            const booking = await db.booking.create({
                data:{
                    cityId: Number(cityId),
                    bookingPlanId: bookingPlanId,
                    date: new Date(date),
                    userId: req.user.id,
                    khalti_token: response.data.idx, 
                    mobile: response.data.user.mobile
                }
            })
            return res.json({message: "Booking Was Successful"})
        }
        res.status(response.status)
        res.json({message: response.data.token})
    }catch(err){
        next(err)
    }
})


module.exports = router