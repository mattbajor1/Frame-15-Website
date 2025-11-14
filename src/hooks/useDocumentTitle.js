import { useEffect } from 'react';

/**
 * Custom hook to update document title dynamically
 * @param {string} title - The page title
 * @param {boolean} [withSuffix=true] - Whether to append " | Frame 15"
 */
export default function useDocumentTitle(title, withSuffix = true) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = withSuffix ? `${title} | Frame 15` : title;

    return () => {
      document.title = prevTitle;
    };
  }, [title, withSuffix]);
}
