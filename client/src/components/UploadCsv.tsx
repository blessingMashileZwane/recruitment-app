import Papa from 'papaparse'
import React from 'react'
import type { Candidate } from '../types'

function UploadCsv({ onUpload }: { onUpload: (c: Candidate[]) => void }) {
    // function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    //     const file = e.target.files?.[0]
    //     if (!file) return
    //     Papa.parse(file, {
    //         header: true,
    //         skipEmptyLines: true,
    //         complete: (results: any) => {
    //             // Expect CSV columns: firstName,lastName,email,role
    //             const data = (results.data as any[]).map((row) => ({
    //                 id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    //                 firstName: row.firstName || row.first_name || row.FirstName || '',
    //                 lastName: row.lastName || row.last_name || row.LastName || '',
    //                 email: row.email || row.Email || '',
    //                 role: row.role || row.Role || '',
    //                 status: 'Applied',
    //                 feedback: [],
    //             }))
    //             onUpload(data)
    //             alert(`Uploaded ${data.length} candidates`)
    //         },
    //     })
    // }

    // return (
    //     <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
    //         <h2 className="text-lg font-semibold mb-3">Upload Candidates (CSV)</h2>
    //         <p className="text-sm text-gray-500 mb-3">CSV should have headers: <code>firstName,lastName,email,role</code></p>
    //         <input type="file" accept=".csv,text/csv" onChange={handleFile} />
    //         <div className="mt-4 text-sm text-gray-500">Note: Excel (.xlsx) import can be supported using libraries like <code>xlsx</code> — add it and parse similar to CSV.</div>
    //     </div>
    // )
}

export default UploadCsv;
