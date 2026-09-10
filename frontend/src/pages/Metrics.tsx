import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Heart, Activity, Clock, Weight, Moon } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import AddMeasurementModal from '@/components/modals/AddMeasurementModal';
import { useHealthMetrics } from '@/hooks/useHealthMetrics';

const Metrics = () => {
  const { toast } = useToast();
  const { 
    metrics, 
    summary, 
    loading, 
    getMetricsByType, 
    getLatestMetric, 
    getSummaryByType,
    fetchMetrics,
    fetchSummary 
  } = useHealthMetrics();

  const weightMetrics = getMetricsByType('weight');
  const restingHrMetrics = getMetricsByType('heart_rate_resting');
  const activeHrMetrics = getMetricsByType('heart_rate_active');
  const sleepMetrics = getMetricsByType('sleep_hours');
  const bpSystolicMetrics = getMetricsByType('blood_pressure_systolic');
  const bpDiastolicMetrics = getMetricsByType('blood_pressure_diastolic');

  // Transform real user data for charts
  const weightData = weightMetrics.map(metric => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: metric.value
  })).reverse();

  const heartRateData = restingHrMetrics.map(metric => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    resting: metric.value,
    active: activeHrMetrics.find(m => 
      new Date(m.date).toDateString() === new Date(metric.date).toDateString()
    )?.value || 0
  })).reverse();

  const sleepData = sleepMetrics.map(metric => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    hours: metric.value,
    deep: getMetricsByType('sleep_deep').find(m => 
      new Date(m.date).toDateString() === new Date(metric.date).toDateString()
    )?.value || 0,
    light: getMetricsByType('sleep_light').find(m => 
      new Date(m.date).toDateString() === new Date(metric.date).toDateString()
    )?.value || 0,
    rem: getMetricsByType('sleep_rem').find(m => 
      new Date(m.date).toDateString() === new Date(metric.date).toDateString()
    )?.value || 0
  })).reverse();

  const bloodPressureData = bpSystolicMetrics.map(metric => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    systolic: metric.value,
    diastolic: bpDiastolicMetrics.find(m => 
      new Date(m.date).toDateString() === new Date(metric.date).toDateString()
    )?.value || 0
  })).reverse();

  // Create recent measurements from real user data
  const recentMeasurements = [
    { 
      name: 'Weight', 
      value: getLatestMetric('weight') ? `${getLatestMetric('weight')?.value} ${getLatestMetric('weight')?.unit}` : 'No data', 
      date: getLatestMetric('weight') ? new Date(getLatestMetric('weight')?.date || '').toLocaleDateString() : 'Not recorded', 
      icon: Weight 
    },
    { 
      name: 'BMI', 
      value: getLatestMetric('bmi') ? getLatestMetric('bmi')?.value.toString() : 'No data', 
      date: getLatestMetric('bmi') ? new Date(getLatestMetric('bmi')?.date || '').toLocaleDateString() : 'Not recorded', 
      icon: Activity 
    },
    { 
      name: 'Body Fat', 
      value: getLatestMetric('body_fat') ? `${getLatestMetric('body_fat')?.value}${getLatestMetric('body_fat')?.unit}` : 'No data', 
      date: getLatestMetric('body_fat') ? new Date(getLatestMetric('body_fat')?.date || '').toLocaleDateString() : 'Not recorded', 
      icon: Weight 
    },
    { 
      name: 'Resting Heart Rate', 
      value: getLatestMetric('heart_rate_resting') ? `${getLatestMetric('heart_rate_resting')?.value} ${getLatestMetric('heart_rate_resting')?.unit}` : 'No data', 
      date: getLatestMetric('heart_rate_resting') ? new Date(getLatestMetric('heart_rate_resting')?.date || '').toLocaleDateString() : 'Not recorded', 
      icon: Heart 
    },
    { 
      name: 'Blood Pressure', 
      value: getLatestMetric('blood_pressure_systolic') && getLatestMetric('blood_pressure_diastolic') 
        ? `${getLatestMetric('blood_pressure_systolic')?.value}/${getLatestMetric('blood_pressure_diastolic')?.value}` 
        : 'No data', 
      date: getLatestMetric('blood_pressure_systolic') ? new Date(getLatestMetric('blood_pressure_systolic')?.date || '').toLocaleDateString() : 'Not recorded', 
      icon: Activity 
    },
    { 
      name: 'Avg. Sleep', 
      value: getLatestMetric('sleep_hours') ? `${getLatestMetric('sleep_hours')?.value} hrs` : 'No data', 
      date: getLatestMetric('sleep_hours') ? new Date(getLatestMetric('sleep_hours')?.date || '').toLocaleDateString() : 'Not recorded', 
      icon: Clock 
    },
  ];

  const handleMeasurementAdded = () => {
    fetchMetrics();
    fetchSummary();
  };

  const renderEmptyTab = (metricTitle: string, description: string, Icon: React.ElementType) => (
    <div className="h-72 flex flex-col items-center justify-center text-center p-8 space-y-3 bg-card/40 rounded-2xl border border-dashed border-border/60">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="w-7 h-7 opacity-75" />
      </div>
      <div>
        <h3 className="font-semibold text-base text-foreground">No {metricTitle.toLowerCase()} data recorded</h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {description}
        </p>
      </div>
      <div className="pt-2">
        <AddMeasurementModal onMeasurementAdded={handleMeasurementAdded} />
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Health Metrics</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Track and monitor your personal health indicators</p>
        </div>
        <AddMeasurementModal onMeasurementAdded={handleMeasurementAdded} />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {recentMeasurements.map((measurement, idx) => (
          <Card key={idx} className="p-1 sm:p-0">
            <CardHeader className="pb-1 sm:pb-2 pt-3 sm:pt-4 px-3 sm:px-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{measurement.name}</CardTitle>
                <div className="p-1 sm:p-1.5 rounded-full bg-primary/10 text-primary shrink-0">
                  <measurement.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-base sm:text-2xl font-bold truncate">{measurement.value}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{measurement.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="weight" className="w-full">
        <div className="overflow-x-auto pb-2 no-scrollbar">
          <TabsList className="mb-6 w-full justify-start sm:justify-center flex-nowrap min-w-max">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
          </TabsList>
        </div>
        
        {/* WEIGHT TAB */}
        <TabsContent value="weight" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Weight Tracking</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your weight progress over time</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {weightData.length === 0 ? (
                renderEmptyTab("Weight", "Log your body weight periodically to visualize changes and monitor trends.", Weight)
              ) : (
                <>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          domain={['dataMin - 1', 'dataMax + 1']}
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          label={{ 
                            value: 'kg', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } 
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                            color: 'hsl(var(--card-foreground))'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          fillOpacity={1}
                          fill="url(#colorWeight)"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          dot={{ r: 3, strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Starting</p>
                      <p className="text-lg font-bold">
                        {`${weightMetrics[weightMetrics.length - 1]?.value} ${weightMetrics[weightMetrics.length - 1]?.unit}`}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="text-lg font-bold">
                        {`${getLatestMetric('weight')?.value} ${getLatestMetric('weight')?.unit}`}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Change</p>
                      <p className="text-lg font-bold text-teal-400">
                        {weightMetrics.length > 1 
                          ? `${((getLatestMetric('weight')?.value || 0) - (weightMetrics[weightMetrics.length - 1]?.value || 0)).toFixed(1)} kg`
                          : '0 kg'
                        }
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* HEART RATE TAB */}
        <TabsContent value="heart-rate" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Heart Rate</CardTitle>
                  <CardDescription>Resting and active heart rate</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {heartRateData.length === 0 ? (
                renderEmptyTab("Heart Rate", "Record your resting or active heart rate in bpm to monitor cardiovascular performance.", Heart)
              ) : (
                <>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heartRateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          label={{ 
                            value: 'bpm', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } 
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                            color: 'hsl(var(--card-foreground))'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          name="Resting"
                          dataKey="resting" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          dot={{ r: 3, fill: 'hsl(var(--background))', strokeWidth: 2 }}
                        />
                        <Line 
                          type="monotone" 
                          name="Active"
                          dataKey="active" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          dot={{ r: 3, fill: 'hsl(var(--background))', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Latest Resting</p>
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        <p className="text-lg font-bold">
                          {getLatestMetric('heart_rate_resting') 
                            ? `${getLatestMetric('heart_rate_resting')?.value} bpm`
                            : '-- bpm'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Latest Active</p>
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="h-5 w-5 text-accent" />
                        <p className="text-lg font-bold">
                          {getLatestMetric('heart_rate_active') 
                            ? `${getLatestMetric('heart_rate_active')?.value} bpm`
                            : '-- bpm'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SLEEP TAB */}
        <TabsContent value="sleep" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sleep Tracking</CardTitle>
                  <CardDescription>Your sleep duration and stages</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {sleepData.length === 0 ? (
                renderEmptyTab("Sleep", "Log your hours of sleep to track recovery and sleep architecture over time.", Moon)
              ) : (
                <>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sleepData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorDeep" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#93c5fd" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRem" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          label={{ 
                            value: 'hours', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } 
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                            color: 'hsl(var(--card-foreground))'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          name="Total Sleep"
                          dataKey="hours" 
                          stroke="hsl(var(--primary))" 
                          fill="none"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          dot={{ r: 3, strokeWidth: 2 }}
                        />
                        <Area 
                          type="monotone" 
                          name="Deep Sleep" 
                          dataKey="deep" 
                          stackId="1" 
                          stroke="#3b82f6" 
                          fill="url(#colorDeep)" 
                        />
                        <Area 
                          type="monotone" 
                          name="Light Sleep" 
                          dataKey="light" 
                          stackId="1" 
                          stroke="#93c5fd" 
                          fill="url(#colorLight)" 
                        />
                        <Area 
                          type="monotone" 
                          name="REM Sleep" 
                          dataKey="rem" 
                          stackId="1" 
                          stroke="#818cf8" 
                          fill="url(#colorRem)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Sleep</p>
                      <p className="text-lg font-bold">
                        {getLatestMetric('sleep_hours') 
                          ? `${getLatestMetric('sleep_hours')?.value} hrs`
                          : '-- hrs'
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Deep</p>
                      <p className="text-lg font-bold text-blue-500">
                        {getLatestMetric('sleep_deep') 
                          ? `${getLatestMetric('sleep_deep')?.value} hrs`
                          : '-- hrs'
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Light</p>
                      <p className="text-lg font-bold text-blue-300">
                        {getLatestMetric('sleep_light') 
                          ? `${getLatestMetric('sleep_light')?.value} hrs`
                          : '-- hrs'
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">REM</p>
                      <p className="text-lg font-bold text-indigo-400">
                        {getLatestMetric('sleep_rem') 
                          ? `${getLatestMetric('sleep_rem')?.value} hrs`
                          : '-- hrs'
                        }
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* BLOOD PRESSURE TAB */}
        <TabsContent value="blood-pressure" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Blood Pressure</CardTitle>
                  <CardDescription>Systolic and diastolic measurements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {bloodPressureData.length === 0 ? (
                renderEmptyTab("Blood Pressure", "Track your systolic and diastolic measurements to monitor cardiovascular health.", Activity)
              ) : (
                <>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bloodPressureData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          label={{ 
                            value: 'mmHg', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } 
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                            color: 'hsl(var(--card-foreground))'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          name="Systolic"
                          dataKey="systolic" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          dot={{ r: 3, fill: 'hsl(var(--background))', strokeWidth: 2 }}
                        />
                        <Line 
                          type="monotone" 
                          name="Diastolic"
                          dataKey="diastolic" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                          dot={{ r: 3, fill: 'hsl(var(--background))', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Latest Systolic</p>
                      <p className="text-lg font-bold text-accent">
                        {getLatestMetric('blood_pressure_systolic') 
                          ? `${getLatestMetric('blood_pressure_systolic')?.value} mmHg`
                          : '-- mmHg'
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Latest Diastolic</p>
                      <p className="text-lg font-bold text-primary">
                        {getLatestMetric('blood_pressure_diastolic') 
                          ? `${getLatestMetric('blood_pressure_diastolic')?.value} mmHg`
                          : '-- mmHg'
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="text-lg font-bold text-teal-400">Recorded</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Metrics;
