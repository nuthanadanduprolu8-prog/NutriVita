import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout
import MainLayout from './components/layout/MainLayout';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VitaminExplorer from './pages/VitaminExplorer';
import FoodExplorer from './pages/FoodExplorer';
import FoodScanner from './pages/FoodScanner';
import BalanceMyMeal from './pages/BalanceMyMeal';
import SmartMealPlanner from './pages/SmartMealPlanner';
import SavedPlans from './pages/SavedPlans';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import VitaMateAI from './pages/VitaMateAI';
import SymptomChecker from './pages/SymptomChecker';
import LabelLens from './pages/LabelLens';
import VitaQuiz from './pages/VitaQuiz';
import NutritionAwareness from './pages/NutritionAwareness';
import BodyChangeAnalyzer from './pages/BodyChangeAnalyzer';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
            {/* Public Core Routes */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/login"
              element={
                <MainLayout hideFooter>
                  <Login />
                </MainLayout>
              }
            />
            <Route
              path="/register"
              element={
                <MainLayout hideFooter>
                  <Register />
                </MainLayout>
              }
            />
            <Route
              path="/vitamins"
              element={
                <MainLayout>
                  <VitaminExplorer />
                </MainLayout>
              }
            />
            <Route
              path="/food-explorer"
              element={
                <MainLayout>
                  <FoodExplorer />
                </MainLayout>
              }
            />
            <Route
              path="/food-scanner"
              element={
                <MainLayout>
                  <FoodScanner />
                </MainLayout>
              }
            />
            <Route
              path="/label-lens"
              element={
                <MainLayout>
                  <LabelLens />
                </MainLayout>
              }
            />
            <Route
              path="/balance-my-meal"
              element={
                <MainLayout>
                  <BalanceMyMeal />
                </MainLayout>
              }
            />
            <Route
              path="/meal-planner"
              element={
                <MainLayout showSidebar sidebarComponent={<Sidebar />}>
                  <SmartMealPlanner />
                </MainLayout>
              }
            />
            <Route
              path="/saved-plans"
              element={
                <MainLayout showSidebar sidebarComponent={<Sidebar />}>
                  <SavedPlans />
                </MainLayout>
              }
            />

            {/* Interactive Health Suite */}
            <Route
              path="/symptom-checker"
              element={
                <MainLayout>
                  <SymptomChecker />
                </MainLayout>
              }
            />
            <Route
              path="/vitamate-ai"
              element={
                <MainLayout>
                  <VitaMateAI />
                </MainLayout>
              }
            />
            <Route
              path="/vita-quiz"
              element={
                <MainLayout>
                  <VitaQuiz />
                </MainLayout>
              }
            />
            <Route
              path="/nutrition-awareness"
              element={
                <MainLayout>
                  <NutritionAwareness />
                </MainLayout>
              }
            />
            <Route
              path="/body-change-analyzer"
              element={
                <MainLayout>
                  <BodyChangeAnalyzer />
                </MainLayout>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout showSidebar sidebarComponent={<Sidebar />}>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout showSidebar sidebarComponent={<Sidebar />}>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <NotFound />
                </MainLayout>
              }
            />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
