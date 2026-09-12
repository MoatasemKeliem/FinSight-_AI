import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Pricing from "./Pages/Pricing";
import Dashboard from "./Pages/Dashboard";
import CompanyProfile from "./Pages/CompanyProfile";
import DataDocuments from "./Pages/DataDocuments";
import AIInsights from "./Pages/AIInsights";
import RiskAnalysis from "./Pages/RiskAnalysis";
import Predictions from "./Pages/Predictions";
import Recommendations from "./Pages/Recommendations";
import SimulateScenario from "./Pages/SimulateScenario";
import AIChat from "./Pages/AIChat";
import ProtectedRoute from "./Components/ProtectedRoutes";
import SinglePrediction from "./Pages/SinglePrediction";
import SingleDocument from "./Pages/SingleDocument";
import SingleFinancialRecord from "./Pages/SingleFinancialRecord";
import SingleRisk from "./Pages/SingleRisk";
import GenerateReport from "./Pages/GenerateReport";
import Onboarding from "./Pages/Onboarding";

export const router = createBrowserRouter([{
    path: "/",
    element: <Layout />,
    children: [
        {
            index: true,
            element: <HomePage />
        }, {
            path: "login",
            element: <Login />
        }, {
            path: "register",
            element: <Register />
        }, {
            path: "pricing",
            element: <Pricing />
        }, {
            path: "onboarding",
            element: <Onboarding />
        }, {
            element: <ProtectedRoute />,
            children: [
                { path: "dashboard", element: <Dashboard /> },
                { path: "generate_report", element: <GenerateReport /> },
                { path: "companyprofile", element: <CompanyProfile /> },
                { path: "documents", element: <DataDocuments /> },
                { path: "aiinsight", element: <AIInsights /> },
                { path: "risk", element: <RiskAnalysis /> },
                { path: "predictions", element: <Predictions /> },
                { path: "recommendations", element: <Recommendations /> },
                { path: "scenario", element: <SimulateScenario /> },
                { path: "chat", element: <AIChat /> },

                { path: "single_prediction/:id", element: <SinglePrediction /> },
                { path: "single_Document/:id", element: <SingleDocument /> },
                { path: "single_Financial/:id", element: <SingleFinancialRecord /> },
                { path: "single_Risk/:id", element: <SingleRisk /> },
            ]
        }
    ]
}])
