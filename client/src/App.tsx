import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import ProtectedRoute from "./ProtectedRoute";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Subscription from "./pages/Subscription";
import Subscribe from "./pages/Subscribe";
import NotFound from "./pages/NotFound";

import UserProfile from "./components/UserProfile";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/learn" element={<Learn />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}

export default App;
