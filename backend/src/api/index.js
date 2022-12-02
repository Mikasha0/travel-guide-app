const router = require('express').Router();
const auth = require('./auth')
const cities = require('./cities') 
const places = require('./places')
const experiences = require('./experiences')
const bookingPlans = require('./booking-plan')
const bookings = require('./booking')
const users = require('./user')
const guides = require('./guide')
const events = require('./events')

router.use('/auth', auth);
router.use('/cities', cities);
router.use('/places', places);
router.use('/experiences', experiences);
router.use('/booking-plans', bookingPlans);
router.use('/bookings', bookings);
router.use('/users', users);
router.use('/guides',guides);
router.use('/events',events);

module.exports = router;
