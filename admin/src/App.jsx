import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import AdminNavbar from "./components/AdminNavbar";

import TestForm from "./pages/TestForm";
import Submissions from "./pages/Submissions";
import SubmissionEvaluation from "./pages/SubmissionEvaluation";
import CreatedTests from "./pages/CreatedTests";
import QuestionBank from "./pages/QuestionBank"
import QuestionFolderDetails from "./pages/QuestionFolderDetails";
// import AddQuestions from "./pages/AddQuestions";

// Layout Wrapper
const Layout = () => {

  return (

    <div className="flex min-h-screen bg-base-100">

      {/* Sidebar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        <Outlet />

      </main>

    </div>
  );
};

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Layout Routes */}
        <Route element={<Layout />}>

          {/* Default Route */}
          <Route
            path="/"
            element={
              <Navigate
                to="/created-tests"
              />
            }
          />

          {/* Create Test */}
          <Route
            path="/create-test"
            element={<TestForm />}
          />

          {/* Edit Test */}
          <Route
            path="/edit-test/:id"
            element={<TestForm />}
          />

          {/* Created Tests */}
          <Route
            path="/created-tests"
            element={<CreatedTests />}
          />

          {/* New Submissions */}
          <Route
            path="/submissions"
            element={
              <Submissions
                newSubmissions={true}
              />
            }
          />

          {/* Submission History */}
          <Route
            path="/submissions/history"
            element={
              <Submissions
                newSubmissions={false}
              />
            }
          />
          <Route
            path="/submissions/new"
            element={
              <Submissions newSubmissions={true} />
            }
          />

          {/* Submission Evaluation */}
          <Route
            path="/submissions/:submissionId"
            element={
              <SubmissionEvaluation />
            }
          />
          <Route
            path="/question-bank"
            element={<QuestionBank />}
          />

          <Route
            path="/question-bank/:folderId"
            element={<QuestionFolderDetails />}
          />

        </Route>



      </Routes>


    </BrowserRouter>
  );
}

export default App;