import React from 'react';
import { useProgress } from '../hooks/useProgress';
import ImageUploader from '../components/progress/ImageUploader';
import ProgressGallery from '../components/progress/ProgressGallery';
import { useAuth } from '../contexts/AuthContext'; // 1. Import your auth hook

const Progress: React.FC = () => {
  const { currentUser } = useAuth(); // 2. Get the logged-in user
  
  // 3. Pass the user's UID to the useProgress hook
  const { entries, loading, error, addProgressEntry, deleteProgressEntry } = useProgress(currentUser?.uid);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Visual Progress Tracker
        </h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Your only competition is who you were yesterday. See your transformation.
        </p>

        <ImageUploader onAddEntry={addProgressEntry} />

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your progress...</p>
          </div>
        )}

        {error && <p className="text-center text-red-500 mt-8">{error}</p>}
        
        {!loading && !error && (
            <ProgressGallery entries={entries} onDelete={deleteProgressEntry} />
        )}
      </div>
    </div>
  );
};

export default Progress;