import { ChevronLeft, ChevronRight, Eye, MessageSquare, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Candidate } from '../types';
import { mockGraphQL } from '../mock/mockData';
import CandidateItem from './ui/CandidateItem';

type CandidateListProps = {
    onViewDetails: (id: string) => void;
    onViewFeedback: (candidateId: string) => void;
}

function CandidateList({ onViewDetails, onViewFeedback }: CandidateListProps) {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (candidates.length === 0) {
            loadCandidates();
        }
    }, [candidates.length]);

    const loadCandidates = async () => {
        setLoading(true);
        try {
            const { candidates, total, totalPages } = await mockGraphQL.getCandidates();
            console.log("Loaded candidates:", candidates);
            setCandidates(candidates);
            setTotal(total);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Failed to load candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [positionFilter, setPositionFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'position' | 'experience' | 'addedDate'>('addedDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    console.log("Current candidates:", candidates);

    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [searchTerm, statusFilter, positionFilter, sortBy, sortOrder]);

    return (
        <>
            {loading ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span>Loading...</span>
                    </div>
                </div>
            ) : <>
                <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
                    <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-700">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} candidates
                        </p>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {candidates.map((candidate) => (
                            <CandidateItem
                                key={candidate.id}
                                candidate={candidate}
                                onViewDetails={() => onViewDetails(candidate.id)}
                                onViewFeedback={() => onViewFeedback(candidate.id)}
                            />
                        ))}
                    </ul>
                </div>
                {
                    totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Page <span className="font-medium">{currentPage}</span> of{' '}
                                        <span className="font-medium">{totalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNumber === currentPage
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )
                }</>}
        </>
    );
}

export default CandidateList;


