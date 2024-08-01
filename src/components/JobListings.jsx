import { useState, useEffect } from 'react';
import axios from 'axios';
import JobListing from './JobListing';
import Spinner from './Spinner';

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const apiUrl = isHome 
        ? `https://backendjoblistingwebsite.onrender.com/api/jobs?_limit=3&_page=${page}`
        : `https://backendjoblistingwebsite.onrender.com/api/jobs?_page=${page}`;

      try {
        setLoading(true);
        const { data } = await axios.get(apiUrl);

        if (data.length === 0) {
          setHasMore(false); // No more jobs to load
        } else {
          setJobs(prevJobs => [...prevJobs, ...data]);
        }
      } catch (error) {
        console.log('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isHome, page]);

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
       
