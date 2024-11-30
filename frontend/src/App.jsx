import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { College_Login } from './Pages/College/College_Login';
import { College_Register } from './Pages/College/College_Register';
import { Student_Login } from './Pages/Student/Stu_Login';
import { Student_Register } from './Pages/Student/Stu_Reg';
import { Home } from './Pages/Home/Home';
import { Login } from './Pages/Home/Login';
import { AuthProvider } from './Context/AuthProvider';
import { useAuth } from "./Context/AuthProvider";
import { Logout } from './Pages/Home/Logout';
import { Verification } from './Pages/Student/Verification';
import { Otp } from './Pages/Student/Otp';
import { BlogDetail } from './Pages/BlogJ/BlogDetail';
import { BlogPage } from './Pages/BlogJ/BlogPage';
import {AddBlog} from  './Pages/BlogJ/addBlog';
import {Participants} from './Pages/Profile/Participant'
// import BlogHome from './Pages/BlogPage/pages/Blogs';
// import Blog from './Pages/BlogPage/pages/Blog';
import {EventForm} from './Pages/Event_listing_page/EventListingForm';
import { Forgot_Pass_Col } from './Pages/College/Forgot_Pass';
import { Forgot_Pass_Stu } from './Pages/Student/Forgot_Pass';
import { College_otp } from './Pages/College/College_otp';
import { ProfilePage } from './Pages/Profile/Student_Profile';
import { Profile_Otp } from './Pages/Profile/Profile_Otp';
import { CollegeProfile } from './Pages/Profile/College_Profile';
import { Club_Otp } from './Pages/Profile/Club_Otp';
import { ClubProfile } from './Pages/Profile/ClubProfile';
import { Events_Page } from './Pages/EventDetails/Events_Page';
import { Register_For_Event } from './Pages/EventDetails/Register_For_Event';
import { Payment } from './Pages/EventDetails/Payment';
import Cookies from "js-cookie"

export const App = () => {
  const type = Cookies.get("type");
  return (
    <>
      <Router >
        <AuthProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/add-blog" element={<AddBlog/>} />
            <Route path='/listing/:isEdit' element={<EventForm />} />
            <Route path="/college-login" element={<College_Login />} />
            <Route path="/college-register" element={<College_Register />} />
            <Route path="/student-login" element={<Student_Login />} />
            <Route path="/student-register" element={<Student_Register />} />
            <Route path='/verification' element={<Verification />} />
            <Route path='/otp/:userId' element={<Otp />} />
            <Route path='/college-otp/:userId' element={<College_otp />} />
            <Route path='/profile-otp/:userId' element={<Profile_Otp />} />
            <Route path='/club-otp/:userId' element={<Club_Otp />} />
            <Route path='/forgot-password-col' element={<Forgot_Pass_Col/>} />
            <Route path='/forgot-password-stu' element={<Forgot_Pass_Stu/>} />  
            <Route path='/events-page' element={<Events_Page/>} />
            <Route path="/" element={<Home />} />
            <Route path='/event/:id' element={<Register_For_Event/>} />
            <Route path='/payment/:id' element={<Payment/>} />

            {type === "club" && (
              <>
                <Route path='/participants/:eventId' element={<Participants/>} />
              </>
            )}
            {type === "user" && (
              <Route path="/student-profile" element={<ProfilePage />} />
            )}
            {type === "college" && (
              <Route path="/college-profile" element={<CollegeProfile />} />
            )}
            {type === "club" && (
              <Route path="/club-profile" element={<ClubProfile />} />
            )}
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
};
