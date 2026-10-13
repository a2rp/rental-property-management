import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";

const Overview = lazy(() => import("./pages/overview"));
const Properties = lazy(() => import("./pages/properties"));
const Leases = lazy(() => import("./pages/leases"));
const Maintenance = lazy(() => import("./pages/maintenance"));
const NotFound = lazy(() => import("./pages/notFound"));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

const AppRoutes = ({ properties, leases, requests, handlers, notify }) => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Suspense key={location.pathname} fallback={<Loading />}>
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview properties={properties} leases={leases} requests={requests} onMarkPaid={handlers.onMarkRentPaid} />} />
          <Route path="/properties" element={<Properties properties={properties} leases={leases} onSaveProperty={handlers.onSaveProperty} onRemoveProperty={handlers.onRemoveProperty} notify={notify} />} />
          <Route path="/leases" element={<Leases leases={leases} properties={properties} onSaveLease={handlers.onSaveLease} onMarkRentPaid={handlers.onMarkRentPaid} onEndLease={handlers.onEndLease} notify={notify} />} />
          <Route path="/maintenance" element={<Maintenance requests={requests} properties={properties} onCreateRequest={handlers.onCreateRequest} onUpdateRequest={handlers.onUpdateRequest} onDeleteRequest={handlers.onDeleteRequest} notify={notify} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
