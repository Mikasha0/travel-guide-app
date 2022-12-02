const router = require("express").Router();
const db = require('../../client')
const {userAuth, adminAuth} = require('../../middlewares')


router.get("/",async(req,res,next)=>{
    try {
        const users = await db.user.findMany({
            where:{
                role: "GUIDE",
                cityId: req.body.cityId !==null?Number(req.query.cityId):undefined
            }
        })
        return res.json({data: users})
    } catch (error) {
        next(error)
    }
})

router.get("/:id",async(req,res,next)=>{
    try {
        const user = await db.user.findFirst({
            where:{
                id: Number(req.params.id),
                role: "GUIDE",
        }, 
        include:{
        	city:true,
        }})
        if(!user){
           return res.sendStatus(404);
        }
        return res.json({data: user})
    } catch (error) {
        next(error)
    }
})

router.post("/:id/complaints",userAuth,async(req,res,next)=>{
    try {
        const report = await db.report.upsert({
            create:{
                userId: Number(req.user.id),
                guideId: Number(req.params.id),
                description: req.body.description
            },
            update:{
                description: req.body.description
            },
            where:{
                userId_guideId: {
                    userId: Number(req.user.id),
                    guideId: Number(req.params.id)
                }
            }
        })
        return res.json({message: "Complaint added"})
    } catch (error) {
        next(error)
    }
})

router.get("/:id/complaints",adminAuth,async(req,res,next)=>{
    try {
        const reports = await db.report.findMany({
            where:{
                guideId: Number(req.params.id)
            },
            include:{
                user: true
            }
        })
        return res.json({data: reports})
    } catch (error) {
        next(error)
    }
})


router.get("/:id/reviews",async(req,res,next)=>{
    try {
        const aggregrate = await db.rating.aggregate({
            _avg:{
                stars: true
            },
            where:{
                guideId: Number(req.params.id)
            }
        })
        const reports = await db.rating.findMany({
            where:{
                guideId: Number(req.params.id)
            },
            include:{
                user: true
            }
        })

        return res.json({data: reports, aggregrate: aggregrate})
    } catch (error) {
        next(error)
    }
})

router.post("/:id/reviews",userAuth,async(req,res,next)=>{
    try {
        const review = await db.rating.upsert({
            create:{
                userId: Number(req.user.id),
                guideId: Number(req.params.id),
                stars: Number(req.body.stars)
            },
            update:{
                stars: Number(req.body.stars)
            },
            where:{
                userId_guideId: {
                    userId: Number(req.user.id),
                    guideId: Number(req.params.id)
                }  
            }
        })
        return res.json({message: "Review added"})
    } catch (error) {
        next(error)
    }
})


module.exports = router
