"use client";

import { useState } from "react";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const crimeData = [
  {
    id: "#1",
    category: "Robbery",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
  {
    id: "#2",
    category: "Assault",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
  {
    id: "#3",
    category: "Car Break In",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
  {
    id: "#4",
    category: "Robbery",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
  {
    id: "#3",
    category: "Car Break In",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
  {
    id: "#4",
    category: "Robbery",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
  {
    id: "#3",
    category: "Car Break In",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
  {
    id: "#4",
    category: "Robbery",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
  {
    id: "#3",
    category: "Car Break In",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
  {
    id: "#4",
    category: "Robbery",
    date: "18/06/2025",
    description: "Lorem ipsum",
  },
];

const lineChartData = [
  { month: "Jan", Robbery: 10, Assault: 15, "Car break in": 8 },
  { month: "Feb", Robbery: 20, Assault: 12, "Car break in": 18 },
  { month: "Mar", Robbery: -10, Assault: 25, "Car break in": 5 },
  { month: "Apr", Robbery: 15, Assault: -5, "Car break in": 22 },
  { month: "Mai", Robbery: -20, Assault: 30, "Car break in": -15 },
  { month: "Jun", Robbery: -25, Assault: 20, "Car break in": -10 },
];

const pieChartData = [
  { name: "Robbery", value: 50, color: "#ef4444" }, // Red
  { name: "Car break in", value: 35, color: "#3b82f6" }, // Blue
  { name: "Assault", value: 15, color: "#10b981" }, // Green
];

export default function CrimeDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-black">
            Kraton of Yogyakarta
          </h1>
          <p className="text-gray-600">Crime Statistic</p>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
          <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-black">ID</TableHead>
              <TableHead className="font-semibold text-black">
                <div className="flex items-center gap-1">
                  Criminal category
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-black">
                <div className="flex items-center gap-1">
                  Date
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-black">
                <div className="flex items-center gap-1">
                  Description
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crimeData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Button variant="ghost" size="sm" className="text-gray-500">
          Previous
        </Button>
        <Button size="sm" className="bg-black text-white hover:bg-gray-800">
          1
        </Button>
        <Button variant="ghost" size="sm">
          2
        </Button>
        <Button variant="ghost" size="sm">
          3
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-500">
          Next
        </Button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Kraton of Yogyakarta
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">This Week</span>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold mt-4">5,000,00</div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                robbery: { label: "Robbery", color: "#ef4444" },
                assault: { label: "Assault", color: "#10b981" },
                carBreakIn: { label: "Car break in", color: "#3b82f6" },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="Robbery"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Assault"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Car break in"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Robbery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Assault</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Car break in</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Kraton of Yogyakarta
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">This Week</span>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold mt-4">5,000,00</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ChartContainer
                config={{
                  robbery: { label: "Robbery", color: "#ef4444" },
                  carBreakIn: { label: "Car break in", color: "#3b82f6" },
                  assault: { label: "Assault", color: "#10b981" },
                }}
                className="h-64 w-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Robbery</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Car break in</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Assault</span>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-sm font-semibold">50%</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
