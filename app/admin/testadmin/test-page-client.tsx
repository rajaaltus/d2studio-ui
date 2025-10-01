"use client";

interface TestPageClientProps {
  data: any[];
}

export default function TestPageClient({ data }: TestPageClientProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Admin Page</h1>
      <p className="text-gray-600 mb-4">This is a test page for admin functionality.</p>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Blocks Data:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
