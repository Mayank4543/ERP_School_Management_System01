'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Search, Plus } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const items = [
    {
      id: '1',
      name: 'Chemistry Lab Equipment',
      category: 'Laboratory',
      quantity: 50,
      minStock: 20,
      unit: 'pieces',
      price: 500,
      location: 'Lab Store Room',
      status: 'in-stock',
    },
    {
      id: '2',
      name: 'Sports Equipment - Football',
      category: 'Sports',
      quantity: 15,
      minStock: 10,
      unit: 'pieces',
      price: 800,
      location: 'Sports Room',
      status: 'low-stock',
    },
    {
      id: '3',
      name: 'Textbooks - Mathematics Class 10',
      category: 'Books',
      quantity: 5,
      minStock: 50,
      unit: 'pieces',
      price: 350,
      location: 'Library Store',
      status: 'out-of-stock',
    },
    {
      id: '4',
      name: 'Computer Keyboards',
      category: 'IT Equipment',
      quantity: 45,
      minStock: 20,
      unit: 'pieces',
      price: 600,
      location: 'Computer Lab',
      status: 'in-stock',
    },
  ];

  const stats = {
    totalItems: items.length,
    inStock: items.filter(i => i.status === 'in-stock').length,
    lowStock: items.filter(i => i.status === 'low-stock').length,
    outOfStock: items.filter(i => i.status === 'out-of-stock').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage school inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/inventory/purchase">Purchase Order</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/inventory/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className={`hover:shadow-md transition-shadow ${
            item.status === 'out-of-stock' ? 'border-l-4 border-l-red-500' :
            item.status === 'low-stock' ? 'border-l-4 border-l-yellow-500' : ''
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'in-stock' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                      item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {item.status === 'in-stock' ? 'In Stock' : 
                       item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded">
                      {item.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className={`text-xl font-bold ${
                        item.quantity < item.minStock ? 'text-red-600' : 
                        item.quantity < item.minStock * 1.5 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Min Stock</p>
                      <p className="font-medium">{item.minStock} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unit Price</p>
                      <p className="font-medium">₹{item.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="font-bold text-blue-600">₹{(item.quantity * item.price).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{item.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/inventory/${item.id}`}>View</Link>
                  </Button>
                  <Button size="sm">Add Stock</Button>
                  {item.status === 'out-of-stock' && (
                    <Button size="sm" variant="destructive">Reorder</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
