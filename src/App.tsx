import AuthLayout from "./_Auth/AuthLayout";
import SigninForm from "./_Auth/forms/SigninForm";
import SignupForm from "./_Auth/forms/SignupForm";
import { Home } from "./_Root/pages";
import RootLayout from "./_Root/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import { Routes, Route } from "react-router-dom";
import {Explore,Saved,CreatePost,EditPost,PostDetails,Profile,UpdateProfile}from "./_Root/pages";
 
const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
     
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore/>}/>
           <Route path='/saved' element={<Saved/>}/>
           {/* <Route path='/all-users' element={<AllUsers/>}/> */}
           <Route path='/create-post' element={<CreatePost/>}/>
           <Route path='/update-post/:id' element={<EditPost/>}/>
           <Route path='/posts/:id/' element={<PostDetails/>}/>
           <Route path='/profile/:id/*' element={<Profile/>}/>
          
           <Route path='/update-profile/:id' element={<UpdateProfile/>}/>
        </Route>
      </Routes>
      <Toaster/>
    </main>
  );
};

export default App;
