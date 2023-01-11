import React, { StrictMode, useEffect } from 'react';
import styled from '@emotion/styled';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useMeasure from 'react-use-measure';

import { Footer, Header } from './components';
import './i18n';

import {
  AccountPage,
  BlockPage,
  Blocks,
  DeployPage,
  Home,
  Peers,
} from './pages';
import {
  updateBounds,
  useAppDispatch,
  fetchStatus,
  setIsFirstVisit,
} from './store';
import { useAppRefresh } from './hooks';

const App = () => {
  const [ref, bounds] = useMeasure();

  const dispatch = useAppDispatch();

  useAppRefresh();

  useEffect(() => {
    dispatch(updateBounds(bounds));
  }, [bounds, dispatch]);

  useEffect(() => {
    dispatch(fetchStatus());
  }, [dispatch]);

  const usersVisitationStatus = localStorage.getItem('users-status');

  useEffect(() => {
    if (usersVisitationStatus === null) {
      dispatch(setIsFirstVisit(true));
    }
    localStorage.setItem('users-status', JSON.stringify('user-has-visited'));
  }, [usersVisitationStatus, dispatch]);

  return (
    <StrictMode>
      <React.Suspense fallback="loading...">
        <AppWrapper ref={ref}>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/peers" element={<Peers />} />
              <Route path="/account/:id" element={<AccountPage />} />
              <Route path="/deploy/:id" element={<DeployPage />} />
              <Route path="/block/:id" element={<BlockPage />} />
              <Route path="/blocks" element={<Blocks />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </AppWrapper>
      </React.Suspense>
    </StrictMode>
  );
};

const AppWrapper = styled.div`
  background-color: white;
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr;
`;

export default App;
