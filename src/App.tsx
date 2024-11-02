import React, { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react';
import { developers, repositories, branches, commitStats } from './mockData';
import { DateRangePicker } from './components/DateRangePicker';
import { MultiSelect } from './components/MultiSelect';
import { StatsCard } from './components/StatsCard';

function App() {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedDevs, setSelectedDevs] = useState<string[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const filteredStats = useMemo(() => {
    return commitStats.filter((stat) => {
      const date = stat.date;
      return (
        date >= startDate &&
        date <= endDate &&
        (!selectedDevs.length || selectedDevs.includes(stat.developerId)) &&
        (!selectedRepos.length || selectedRepos.includes(stat.repositoryId)) &&
        (!selectedBranches.length || selectedBranches.includes(stat.branch))
      );
    });
  }, [startDate, endDate, selectedDevs, selectedRepos, selectedBranches]);

  const totalAdditions = useMemo(
    () => filteredStats.reduce((sum, stat) => sum + stat.additions, 0),
    [filteredStats]
  );

  const totalDeletions = useMemo(
    () => filteredStats.reduce((sum, stat) => sum + stat.deletions, 0),
    [filteredStats]
  );

  const totalChanges = useMemo(
    () => filteredStats.reduce((sum, stat) => sum + stat.changes, 0),
    [filteredStats]
  );

  const chartData = useMemo(() => {
    const data: Record<string, any>[] = [];
    const dateMap = new Map();

    filteredStats.forEach((stat) => {
      if (!dateMap.has(stat.date)) {
        dateMap.set(stat.date, {
          date: stat.date,
          additions: stat.additions,
          deletions: stat.deletions,
          changes: stat.changes,
        });
      } else {
        const existing = dateMap.get(stat.date);
        existing.additions += stat.additions;
        existing.deletions += stat.deletions;
        existing.changes += stat.changes;
      }
    });

    dateMap.forEach((value) => data.push(value));
    return data.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredStats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Productivity Analytics</h1>
            <p className="mt-2 text-gray-600">Track and analyze development metrics across repositories</p>
          </div>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MultiSelect
            label="Developers"
            options={developers}
            selectedValues={selectedDevs}
            onChange={setSelectedDevs}
          />
          <MultiSelect
            label="Repositories"
            options={repositories}
            selectedValues={selectedRepos}
            onChange={setSelectedRepos}
          />
          <MultiSelect
            label="Branches"
            options={branches}
            selectedValues={selectedBranches}
            onChange={setSelectedBranches}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Lines Added"
            value={totalAdditions}
            icon={<Plus className="h-6 w-6" />}
            trend={12}
          />
          <StatsCard
            title="Lines Deleted"
            value={totalDeletions}
            icon={<Minus className="h-6 w-6" />}
            trend={-5}
          />
          <StatsCard
            title="Changes"
            value={totalChanges}
            icon={<GitCommit className="h-6 w-6" />}
            trend={8}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Activity Timeline</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="additions"
                  stroke="#10B981"
                  name="Additions"
                />
                <Line
                  type="monotone"
                  dataKey="deletions"
                  stroke="#EF4444"
                  name="Deletions"
                />
                <Line
                  type="monotone"
                  dataKey="changes"
                  stroke="#3B82F6"
                  name="Changes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;