const router  = require('express').Router();
const {body, validationResult} = require('express-validator')
const db = require('../../client')
const {adminAuth} = require('../../middlewares')

const typeRequired = body('type').notEmpty().trim();

router.get('/', async (req,res,next)=>{
    try{
        const experiences = await db.experience.findMany()
        return res.json({"data": experiences})
    }catch(err){
        next(err)
    }
})

router.get('/:id', async (req,res,next)=>{
    try{
        const experience = await db.experience.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if(!experience) {
            res.status(404)
            next(new Error("Experience not found"))
        }
        return res.json({data: experience})
    }catch(err){
        next(err)
    }
})

router.post('/',adminAuth,typeRequired , async (req,res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: errors.array() });
    }

    try{
        const place = await db.experience.create({
            data:{
                type: req.body.type
            }
        })

        return res.json({data: place, message: "Experience Created"})

    }catch(err){
        next(err)
    }
})

router.put('/:id',adminAuth,typeRequired ,async (req,res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: errors.array() });
    }

    try{
        const experience = await db.experience.update({
            where:{
                id: Number(req.params.id)
            },
            data:{
                type: req.body.type
            }
        })

        return res.json({data: experience, message: "Experience Updated"})

    }catch(err){
        next(err)
    }
})

router.delete('/:id',adminAuth ,async (req,res, next)=>{
    try{
        const experience = await db.experience.delete({
            where:{
                id: Number(req.params.id)
            },
        })

        return res.json({data: experience, message: "Experience deleted"})

    }catch(err){
        next(err)
    }
})


module.exports = router;