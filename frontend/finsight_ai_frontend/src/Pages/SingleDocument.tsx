import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { GetDocumentById, DeleteDocumentById } from '../api/document'
import type { IDocument } from '../model/documentModel'
import { FileText, Calendar, ArrowLeft, FileCode, Search, Download, Trash2, Loader2 } from 'lucide-react'

const SingleDocument = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [doc, setDoc] = useState<IDocument | null>(null)
    const [loading, setLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchDoc = async () => {
            if (id) {
                try {
                    const data = await GetDocumentById(id)
                    setDoc(data)
                } catch (error) {
                    console.error("Error fetching document:", error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchDoc()
    }, [id])

    const handleDelete = async () => {
        if (!id || !window.confirm("Are you sure you want to delete this document? This will remove all associated AI insights.")) return
        setIsDeleting(true)
        try {
            await DeleteDocumentById(id)
            navigate("/documents")
        } catch (error) {
            console.error("Delete Error:", error)
            alert("Failed to delete document.")
        } finally {
            setIsDeleting(false)
        }
    }

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
    if (!doc) return <div className="text-center py-20"><p className="text-gray-500">Document not found.</p><Link to="/documents" className="text-indigo-600 hover:underline">Return to Library</Link></div>

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <Link to="/documents" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Document Library
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold text-sm disabled:opacity-50"
                >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    {isDeleting ? "Deleting..." : "Delete Document"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Document Preview/Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <FileCode size={24} className="text-indigo-600" />
                                <h2 className="font-bold text-gray-900 dark:text-slate-50">Extracted Text Content</h2>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                <Search size={18} />
                            </button>
                        </div>
                        <div className="p-8 flex-1 overflow-y-auto">
                            <pre className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                                {doc.extractedText || "No text could be extracted from this document."}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Metadata & Actions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                                <FileText size={48} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="text-center">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-slate-50 break-words">{doc.fileName}</h1>
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">PDF Document</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uploaded On</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{doc.uploadedAt.slice(0, 10)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileCode size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Storage ID</p>
                                    <p className="text-sm font-mono text-gray-900 dark:text-slate-100 break-all overflow-hidden">{doc.id}</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Download size={18} />
                            Download Original
                        </button>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-amber-700 dark:text-amber-500 flex items-center gap-2 mb-2">
                            <Search size={16} /> AI Insights
                        </h3>
                        <p className="text-xs text-amber-800/70 dark:text-amber-400/70 leading-relaxed">
                            This document has been indexed for AI search. You can ask questions about its content in the AI Chat.
                        </p>
                        <Link to="/chat" className="inline-block mt-4 text-xs font-bold text-amber-700 dark:text-amber-500 hover:underline">
                            Ask a question →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleDocument
