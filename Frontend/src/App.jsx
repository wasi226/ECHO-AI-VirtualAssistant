import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Customize from './pages/Customize.jsx';
import Home from './pages/Home.jsx';
import { useContext } from 'react';
import { userDataContext } from './context/UserContext.jsx';
import Customize2 from './pages/Customize2.jsx';

const App = () => {

  const {userData,setUserData}=useContext(userDataContext)


  return (
    <Routes>
      <Route path="/" element={(userData?.assistantImage && userData?.assistantName)? <Home/> : <Navigate to={"/customize"} />} />
      <Route path="/signup" element={ !userData? <SignUp/>:<Navigate to={"/"} />} />
      <Route path="/signin" element={!userData? <SignIn/>:<Navigate to={"/"}/>} />
      <Route path="/customize" element={userData?<Customize/>:<Navigate to={"/signup"} />} />
      <Route path="/customize2" element={userData?<Customize2/>:<Navigate to={"/signup"} />} />
    </Routes>
  )
}

export default App


// App.jsx
// import React, { useContext } from 'react';
// import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import Customize from './pages/Customize.jsx';
// import Home from './pages/Home.jsx';
// import Customize2 from './pages/Customize2.jsx';
// import { userDataContext } from './context/UserContext.jsx';

// /**
//  * ProtectedRoute:
//  * Renders children (via <Outlet/>) only when userData exists.
//  * Otherwise redirects to /signin with replace (stable redirect).
//  */
// const ProtectedRoute = ({ redirectTo = '/signin' }) => {
//   const { userData } = useContext(userDataContext);
//   return userData ? <Outlet /> : <Navigate to={redirectTo} replace />;
// };

// /**
//  * PublicRoute:
//  * Renders children if NOT logged in; otherwise redirect to "/" (home).
//  * Useful for sign-in / sign-up pages.
//  */
// const PublicRoute = ({ redirectTo = '/' }) => {
//   const { userData } = useContext(userDataContext);
//   return !userData ? <Outlet /> : <Navigate to={redirectTo} replace />;
// };

// const App = () => {
//   const { userData } = useContext(userDataContext);

//   return (
//     <Routes>
//       {/*
//         Root route:
//         - If userData && assistantImage exists -> show Home.
//         - If userData exists but assistantImage is missing -> show Home as well
//           but Home will use fallback UI (we already made Home safe).
//         - If userData is null -> redirect to /signin.
//       */}
//       <Route
//         path="/"
//         element={
//           // Use explicit check for userData (not toggling between two Navigates)
//           userData ? <Home /> : <Navigate to="/signin" replace />
//         }
//       />

//       {/* A /home alias route that always renders Home (no redirect logic). */}
//       <Route path="/home" element={<Home />} />

//       {/* Public auth routes (only when not logged in) */}
//       <Route element={<PublicRoute />}>
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/signup" element={<SignUp />} />
//       </Route>

//       {/* Protected routes (only when logged in) */}
//       <Route element={<ProtectedRoute redirectTo="/signin" />}>
//         <Route path="/customize" element={<Customize />} />
//         <Route path="/customize2" element={<Customize2 />} />
//       </Route>

//       {/* fallback - any unknown path -> redirect to root safely */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// };

// export default App;



// App.jsx
// import React, { useContext } from 'react';
// import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import Customize from './pages/Customize.jsx';
// import Home from './pages/Home.jsx';
// import Customize2 from './pages/Customize2.jsx';
// import { userDataContext } from './context/UserContext.jsx';

// /**
//  * ProtectedRoute:
//  * Renders children only if user is logged in, else redirects to /signin.
//  */
// const ProtectedRoute = ({ redirectTo = '/signin' }) => {
//   const { userData } = useContext(userDataContext);
//   return userData ? <Outlet /> : <Navigate to={redirectTo} replace />;
// };

// /**
//  * PublicRoute:
//  * Renders children only if user is NOT logged in, else redirects to /.
//  */
// const PublicRoute = ({ redirectTo = '/' }) => {
//   const { userData } = useContext(userDataContext);
//   return !userData ? <Outlet /> : <Navigate to={redirectTo} replace />;
// };

// const App = () => {
//   const { userData } = useContext(userDataContext);

//   return (
//     <Routes>
//       {/* Root route */}
//       <Route
//         path="/"
//         element={userData ? <Home /> : <Navigate to="/signin" replace />}
//       />

//       {/* Explicit home alias */}
//       <Route path="/home" element={<Home />} />

//       {/* Public routes (only when NOT logged in) */}
//       <Route element={<PublicRoute />}>
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/signup" element={<SignUp />} />
//       </Route>

//       {/* Protected routes (only when logged in) */}
//       <Route element={<ProtectedRoute />}>
//         <Route path="/customize" element={<Customize />} />
//         <Route path="/customize2" element={<Customize2 />} />
//       </Route>

//       {/* Catch-all fallback */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// };

// export default App;
