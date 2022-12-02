const router = require("express").Router();
const db = require('../../client')
const {adminAuth} = require('../../middlewares')


router.get("/", adminAuth ,async(req,res,next)=>{
    try {
        const users = await db.user.findMany({
            where:{
                role: req.body.role !==null?req.query.role:undefined
            }
        })
        return res.json({data: users})
    } catch (error) {
        next(error)
    }
})


module.exports = router
