import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // Remove decimal places
  }).format(price)
}

export function downloadCSV(data: any[], filename: string) {
  // Get headers from first row
  const headers = Object.keys(data[0] || {})
  
  // Convert data to CSV format
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle special cases
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value)
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value)
        return stringValue.includes(',') 
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue
      }).join(',')
    )
  ].join('\n')

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}