import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import axios from 'axios';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import JobPage, { jobLoader } from './pages/JobPage';
import AddJobPage from './pages/AddJobPage';
import EditJobPage from './pages/EditJobPage';

const App = () => {
  // Add New Job
  const addJob = async (newJob) => {
    try {
      await axios.post('http://localhost:8000/api/jobs', newJob);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  // Delete Job
  const deleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/jobs/${id}`);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Update Job
  const updateJob = async (job) => {
    try {
      await axios.put(`http://localhost:8000/api/jobs/${job._id}`, job);
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;  // Ensure the error is propagated
    }
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='/jobs' element={<JobsPage />} />
        <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob} />} />
        <Route
          path='/edit-job/:id'
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={jobLoader}
        />
        <Route
          path='/jobs/:id'
          element={<JobPage deleteJob={deleteJob} />}
          loader={jobLoader}
        />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
