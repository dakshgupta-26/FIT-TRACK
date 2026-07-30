import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface HealthMetric {
  _id: string;
  uid: string;
  type: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthMetricsSummary {
  _id: string;
  latestValue: number;
  latestUnit: string;
  latestDate: string;
}

export const useHealthMetrics = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [summary, setSummary] = useState<HealthMetricsSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchMetrics = async (type?: string, limit = 100) => {
    if (!currentUser?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (type) params.append('type', type);
      
      const response = await fetch(`http://localhost:5000/api/health-metrics/${currentUser.uid}?${params}`);
      const result = await response.json();

      if (result.success) {
        setMetrics(result.metrics);
      } else {
        throw new Error(result.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      console.error('Error fetching health metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!currentUser?.uid) return;

    try {
      const response = await fetch(`http://localhost:5000/api/health-metrics/${currentUser.uid}/summary`);
      const result = await response.json();

      if (result.success) {
        setSummary(result.summary);
      } else {
        throw new Error(result.error || 'Failed to fetch summary');
      }
    } catch (err) {
      console.error('Error fetching health metrics summary:', err);
    }
  };

  const addMetric = async (type: string, value: number, unit: string, date: string, notes?: string) => {
    if (!currentUser?.uid) throw new Error('User not authenticated');

    const response = await fetch('http://localhost:5000/api/health-metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          uid: currentUser.uid,
          type,
          value,
          unit,
          date,
          notes
        }),
    });

    const result = await response.json();

    if (result.success) {
      // Refresh metrics and summary
      await Promise.all([fetchMetrics(), fetchSummary()]);
      return result.healthMetric;
    } else {
      throw new Error(result.error || 'Failed to add metric');
    }
  };

  const updateMetric = async (id: string, value: number, unit: string, date: string, notes?: string) => {
    const response = await fetch(`http://localhost:5000/api/health-metrics/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value,
        unit,
        date,
        notes
      }),
    });

    const result = await response.json();

    if (result.success) {
      // Refresh metrics and summary
      await Promise.all([fetchMetrics(), fetchSummary()]);
      return result.healthMetric;
    } else {
      throw new Error(result.error || 'Failed to update metric');
    }
  };

  const deleteMetric = async (id: string) => {
    const response = await fetch(`http://localhost:5000/api/health-metrics/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      // Refresh metrics and summary
      await Promise.all([fetchMetrics(), fetchSummary()]);
      return true;
    } else {
      throw new Error(result.error || 'Failed to delete metric');
    }
  };

  // Get metrics by type
  const getMetricsByType = (type: string) => {
    return metrics.filter(metric => metric.type === type);
  };

  // Get latest metric by type
  const getLatestMetric = (type: string) => {
    return metrics.find(metric => metric.type === type);
  };

  // Get summary by type
  const getSummaryByType = (type: string) => {
    return summary.find(item => item._id === type);
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchMetrics();
      fetchSummary();
    }
  }, [currentUser?.uid]);

  return {
    metrics,
    summary,
    loading,
    error,
    fetchMetrics,
    fetchSummary,
    addMetric,
    updateMetric,
    deleteMetric,
    getMetricsByType,
    getLatestMetric,
    getSummaryByType
  };
};
