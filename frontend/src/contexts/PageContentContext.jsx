import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PageContentContext = createContext();

export function PageContentProvider({ children }) {
  const [pageContents, setPageContents] = useState(null);
  const [pageSections, setPageSections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPageContent = async (pageName) => {
    if (!pageName) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/pages/${pageName}`);

      if (response.data.success) {
        setPageContents(response.data.data.pageContent);
        setPageSections(response.data.data.sections);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching page content:', err);
      setError(err.message);
      // Set default content in case of error
      setPageContents({
        title: 'Error loading content',
        content: 'Unable to load content at this time'
      });
      setPageSections([]);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    pageContents,
    pageSections,
    loading,
    error,
    fetchPageContent
  };

  return (
    <PageContentContext.Provider value={value}>
      {children}
    </PageContentContext.Provider>
  );
}

export function usePageContent(pageName) {
  const context = useContext(PageContentContext);
  if (!context) {
    throw new Error('usePageContent must be used within a PageContentProvider');
  }

  useEffect(() => {
    if (pageName) {
      context.fetchPageContent(pageName);
    }
  }, [pageName]);

  return {
    pageContents: context.pageContents,
    pageSections: context.pageSections,
    loading: context.loading,
    error: context.error
  };
}
