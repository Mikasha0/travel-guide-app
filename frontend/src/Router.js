import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Auth from './components/ProtectedRoutes/Auth'
import Guest from './components/ProtectedRoutes/Guest'
import Home from './Layouts/Home'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminLandingPage  from './pages/admin/LandingPage'
import PlacesPage from './pages/PlacesPage'
import RegisterPage from './pages/RegisterPage'
import AdminPlaces from './pages/admin/places/Index'
import AdminCreatePlaces from './pages/admin/places/Create'
import AdminEditPlaces from './pages/admin/places/Edit'
import AdminIndexExperiences from './pages/admin/experiences/Index'
import AdminCreateExperiences from './pages/admin/experiences/Create'
import AdminIndexCities from './pages/admin/cities/Index'
import AdminCreateCities from './pages/admin/cities/Create'
import Cities from './pages/Cities'
import CityPage from './pages/CityPage'
import PlansPage from './pages/admin/bookingPlans/Index'
import BookingsPage from './pages/admin/bookings/Index'
import EventsPage from './pages/admin/events/Index'
import Admin from './components/ProtectedRoutes/Admin'
import Guide from './components/ProtectedRoutes/Guide'
import Bookings from './pages/guide/Bookings'
import MyBookings from './pages/MyBookings'
import Place from './pages/Place'
import GuidePage from './pages/GuidePage'
export default function Router() {
  return (
    <Routes> 
        <Route path="/" element={<Home />}>
          <Route index element={<LandingPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/places/:id" element={<Place />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/my-bookings" element={<Auth element={<MyBookings />} />} />
          <Route path="/cities/:id" element={<CityPage />} />
          <Route path="/guides/:id" element={<GuidePage />} />
          <Route path="/bookings" element={<Auth element={<LoginPage />}/>} />
          <Route path="/login" element={<Guest element={<LoginPage />}/>} />
          <Route path="/register" element={<Guest element={<RegisterPage />}/>} />

        </Route>
        <Route path="/guide" element={<Guide element={<Home />}/>}>
         <Route path="bookings" element={<Bookings />} />  
        </Route>
        <Route path="/admin" element={<Admin element={<Home />}/>}>
          <Route index element={<AdminLandingPage />} />
          <Route path="places" element={<AdminPlaces />} />
          <Route path="places/create" element={<AdminCreatePlaces />} />
          <Route path="places/:id" element={<AdminEditPlaces />} />
          <Route path="experiences" element={<AdminIndexExperiences />} />
          <Route path="experiences/create" element={<AdminCreateExperiences />} />
          <Route path="cities" element={<AdminIndexCities />} />
          <Route path="cities/create" element={<AdminCreateCities/>} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="events" element={<EventsPage />} />
        </Route>
    </Routes>
  )
}
