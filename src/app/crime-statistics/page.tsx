'use client'
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, PieLabelRenderProps } from 'recharts'

interface CrimeData {
  id: number
  name: string
  category: string
  date: Date
  crimeRate: string
}

interface CrimeStatisticPageProps {
  crimeData?: CrimeData[]
  locationName: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Define the label renderer function outside the component
const renderCustomizedLabel = ({
  name,
  percent = 0
}: PieLabelRenderProps) => {
  return `${name} ${(percent * 100).toFixed(0)}%`
}

export default function CrimeStatisticPage({ 
  crimeData = [], 
  locationName 
}: CrimeStatisticPageProps) {
  // Process data for charts
  const { categoryData, monthlyData, crimeRateData } = useMemo(() => {
    const categoryCount: Record<string, number> = {}
    const monthlyCount: Record<string, number> = {}
    const crimeRateCount: Record<string, number> = {}

    crimeData.forEach(crime => {
      // Count by category
      categoryCount[crime.category] = (categoryCount[crime.category] || 0) + 1
      
      // Count by month
      const month = crime.date.getMonth()
      monthlyCount[month] = (monthlyCount[month] || 0) + 1
      
      // Count by crime rate
      crimeRateCount[crime.crimeRate] = (crimeRateCount[crime.crimeRate] || 0) + 1
    })

    return {
      categoryData: Object.entries(categoryCount).map(([name, count]) => ({ name, count })),
      monthlyData: Object.entries(monthlyCount).map(([month, count]) => ({
        name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month)],
        count
      })),
      crimeRateData: Object.entries(crimeRateCount).map(([name, value]) => ({ name, value }))
    }
  }, [crimeData])

  // Safely find highest risk category
  const highestRisk = crimeRateData.length > 0 
    ? crimeRateData.reduce((max, curr) => 
        (curr.value ?? 0) > (max.value ?? 0) ? curr : max
      ).name
    : 'N/A'

  if (!crimeData || crimeData.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700">No crime data available</h1>
          <p className="mt-2 text-gray-500">Please check back later or try a different location</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{locationName}</h1>
          <h2 className="text-xl text-gray-600 mt-2">Crime Statistics</h2>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Crimes" value={crimeData.length} />
          <StatCard title="Categories" value={categoryData.length} />
          <StatCard title="Highest Risk" value={highestRisk} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title="Crimes by Category">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Crime Rate Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={crimeRateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={renderCustomizedLabel} // Now properly defined
                >
                  {crimeRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Trend">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Location</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Risk Level</TableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {crimeData.map(crime => (
                  <tr key={crime.id} className="hover:bg-gray-50">
                    <TableCell>#{crime.id}</TableCell>
                    <TableCell>{crime.name}</TableCell>
                    <TableCell>{crime.category}</TableCell>
                    <TableCell>{crime.date.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <RiskBadge crimeRate={crime.crimeRate} />
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Risk badge component
const RiskBadge = ({ crimeRate }: { crimeRate: string }) => {
  const getRiskClass = () => {
    switch(crimeRate) {
      case 'Highest': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getRiskClass()}`}>
      {crimeRate}
    </span>
  )
}

// Reusable components
interface StatCardProps {
  title: string
  value: string | number
}

const StatCard = ({ title, value }: StatCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
  </div>
)

interface ChartCardProps {
  title: string
  children: React.ReactNode
}

const ChartCard = ({ title, children }: ChartCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    {children}
  </div>
)

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
)

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    {children}
  </td>
)