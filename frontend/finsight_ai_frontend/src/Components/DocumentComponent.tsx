import { useEffect, useState } from 'react'
import type { IDocument } from '../model/documentModel'
import { GetAllDocuments } from '../api/document'
import { FileText, Calendar, FileCode, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface IDocumentProps {
    numberOfDocuments: number
    short?: boolean
}

const DocumentComponent = ({ numberOfDocuments, short = false }: IDocumentProps) => {
    const [documents, setDocuments] = useState<IDocument[]>([])

    useEffect(() => {
        const getData = async () => {
            const response = await GetAllDocuments()
            setDocuments(response)
        }
        getData()
    }, [])

    const displayDocuments = typeof numberOfDocuments === "number"
        ? documents.slice(0, numberOfDocuments)
        : documents

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <FileText size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-50">
                        {short ? "Recent Documents" : "All Documents"}
                    </h3>
                </div>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                    {displayDocuments.length} Total
                </span>
            </div>

            {/* Document List */}
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {displayDocuments.length > 0 ? (
                    displayDocuments.map((item) => (
                        <Link 
                            key={item.id} 
                            to={`/single_Document/${item.id}`}
                            className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer block"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-gray-400 group-hover:text-indigo-500 transition-colors">
                                        <FileCode size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {item.fileName}
                                        </p>
                                        {!short && (
                                            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                {item.extractedText}
                                            </p>
                                        )}
                                        <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {item.uploadedAt.slice(0, 10)}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-700"></span>
                                            <span>PDF Document</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-300 dark:text-slate-700 group-hover:text-gray-400 dark:group-hover:text-slate-500 transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="px-6 py-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                            <FileText size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-900 dark:text-slate-100">No documents found</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Upload documents to see them here.</p>
                        </div>
                    </div>
                )}
            </div>
            
            {!short && displayDocuments.length > 0 && (
                <div className="px-6 py-3 bg-gray-50/30 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800">
                    <Link to="/aiinsight" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                        View document analytics →
                    </Link>
                </div>
            )}
        </div>
    )
}

export default DocumentComponent
