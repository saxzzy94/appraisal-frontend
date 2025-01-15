'use client';

import { Card, CardContent } from "@/components/ui/card";

interface Reference {
  id: string;
  date: number | string;
  address: string;
  price: string;
}

interface ReferenceTableProps {
  references: Reference[];
}

function formatDate(date: number | string): string {
  // Convert to string if it's a number
  const dateStr = date.toString();
  
  // Check if the date is in the expected format (YYYYMM)
  if (dateStr.length !== 6) {
    return dateStr; // Return as is if not in expected format
  }

  // Extract year and month
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);

  // Convert month number to month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[parseInt(month) - 1] || month;

  return `${monthName} ${year}`;
}

export function ReferenceTable({ references }: ReferenceTableProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Reference Properties</h2>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3">Date</th>
                <th scope="col" className="px-4 py-3">Address</th>
                <th scope="col" className="px-4 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {references.map((ref) => (
                <tr key={ref.id} className="border-b">
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(ref.date)}
                  </td>
                  <td className="px-4 py-3">{ref.address}</td>
                  <td className="px-4 py-3 font-medium">{ref.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
