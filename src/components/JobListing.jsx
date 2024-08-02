import { useState, useEffect } from 'react';
import axios from 'axios';
import JobListing from './JobListing';
import Spinner from './Spinner';

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To handle if there are more jobs to load

  useEffect(() => {
    const fetchJobs = async () => {
      const apiUrl = isHome 
        ? `https://backendjoblistingwebsite.onrender.com/api/jobs?_limit=3&_page=${page}`
        : `https://backendjoblistingwebsite.onrender.com/api/jobs?_page=${page}`;

      try {
        setLoading(true); // Set loading to true before making the request
        const { data } = await axios.get(apiUrl);
        
        if (data.length === 0) {
          setHasMore(false); // No more jobs to load
        } else {
          setJobs(prevJobs => [...prevJobs, ...data]); // Append new jobs
        }
      } catch (error) {
        console.log('Error fetching data', error);
      } finally {
        setLoading(false); // Always set loading to false after request
      }
    };

    fetchJobs();
  }, [isHome, page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
          {isHome ? 'Recent Jobs' : 'Browse Jobs'}
        </h2>

        {loading && <Spinner loading={loading} />}
        
        {!loading && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobListing key={job._id} job={job} />
              ))
            ) : (
              <p className="text-center text-gray-500">No jobs found.</p>
            )}
          </div>
        )}
        
        {!loading && hasMore && (
          <div className="text-center mt-6">
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
