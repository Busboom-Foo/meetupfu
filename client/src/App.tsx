import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WireframeLayout from './pages/wireframes/components/WireframeLayout';
import WireframeIndex from './pages/wireframes/WireframeIndex';
import ClassPage from './pages/wireframes/ClassPage';
import A2EventRegistration from './pages/wireframes/A2EventRegistration';
import B1Intake from './pages/wireframes/B1Intake';
import B2Donation from './pages/wireframes/B2Donation';
import B3Verification from './pages/wireframes/B3Verification';
import B4Dashboard from './pages/wireframes/B4Dashboard';
import B5Detail from './pages/wireframes/B5Detail';
import B6Voting from './pages/wireframes/B6Voting';
import RequestPublic from './pages/wireframes/RequestPublic';
import RequestPrivate from './pages/wireframes/RequestPrivate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wireframe pages — no auth, no server dependency */}
        <Route path="/" element={<WireframeIndex />} />
        <Route path="/class-page" element={<ClassPage />} />
        <Route path="/a2-registration" element={<A2EventRegistration />} />
        <Route element={<WireframeLayout />}>
          <Route path="/b1-intake" element={<B1Intake />} />
          <Route path="/request-public" element={<RequestPublic />} />
          <Route path="/request-private" element={<RequestPrivate />} />
          <Route path="/b2-donation" element={<B2Donation />} />
          <Route path="/b3-verification" element={<B3Verification />} />
          <Route path="/b4-dashboard" element={<B4Dashboard />} />
          <Route path="/b5-detail" element={<B5Detail />} />
          <Route path="/b6-voting" element={<B6Voting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
