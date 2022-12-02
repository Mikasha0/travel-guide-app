const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const db = require("../../client/index");
const { randomString } = require("../../utils/random");
const bcrypt = require("bcrypt");
const {userAuth} = require('../../middlewares')

const ROLES = ["VISITOR", "GUIDE"]


router.get('/roles', (req, res)=>{
  return res.json({roles: ROLES})
})

const validEmail = body("email")
  .normalizeEmail()
  .isEmail()
  .withMessage("Invalid Email ID");

const validEmailUnique = validEmail
  .custom(async (value) => {
    const user = await db.user.findUnique({
      where: {
        email: value,
      },
    });
    if (user) {
      return Promise.reject("Email Already in use");
    }
    return true;
  })
  .withMessage("Email Already in use");

const nameReq = body("name").notEmpty();


const roleAuth = body('role').custom((value=>{
  if(value==null || value==undefined) return true;
  if(ROLES.includes(value)) return true;
  return Promise.reject("Invalid Role")
}))


const validPassword = body("password").isString().isLength({ min: 8 });

const cityForGuides = body("cityId").if((value, {req})=>{
  return req.body.role ==='GUIDE' 
}).custom(async (value) =>{
  if(!value)  return Promise.reject("City Doesn't exist");
  const city = await db.city.findUnique({
      where: {
        id: value,
      },
    });
    if (!city) {
      return Promise.reject("City Doesn't exist");
    }
    return true;
})

router.post(
  "/signup",
  nameReq,
  validPassword,
  validEmailUnique,
  roleAuth,
  cityForGuides,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Validation Error", errors: errors.array() });
      }

      const { name, email, password, role, cityId } = req.body;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const token = randomString(40);

      const user = await db.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          role: role,
          cityId : cityId,
          Token: {
            create: {
              token: token,
            },
          },
        },
      });
      return res.json({ token: token, message: "Signup was Successful" });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", validEmail, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) return res.status(400).json({ message: "User Doesn't exist" });

    if (await bcrypt.compare(password, user.password)) {
      const token = randomString(40);
      const Token = await db.token.create({
        data: {
          userId: user.id,
          token: token,
        },
      });

      return res.status(200).json({ token: token });
    }
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    next(err);
  }
});

router.get("/user",userAuth,async (req, res, next) => {

    try{
        const user = req.user;
        return res.json({data:user})
    }catch(err){
        next(err)
    }

});


router.post("/logout",userAuth,async (req, res, next) => {

    try{
        const token = req.token;
        const deleteToken = await db.token.delete({
            where:{
                token: token
            }
        })
        return res.json({message:"Logout successful"})
    }catch(err){
        next(err)
    }

});

module.exports = router;
