import { useState, useRef } from "react"
import DocumentComponent from "../Components/DocumentComponent"
import FinancialRecords from "../Components/FinancialRecords"
import { FileText, Database, UploadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { CreateDocumentById } from "../api/document"

const DataDocuments = () => {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<{ message: string, success: boolean } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setUploadStatus(null)
        try {
            await CreateDocumentById(file)
            setUploadStatus({ message: "File uploaded successfully!", success: true })
            // Refresh logic could go here if DocumentComponent supported it via prop
            setTimeout(() => setUploadStatus(null), 3000)
        } catch (error) {
            console.error("Upload Error:", error)
            setUploadStatus({ message: "Failed to upload file. Please try again.", success: false })
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
                        <Database className="text-blue-500" />
                        Data & Documents
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your raw financial data and uploaded corporate documents.</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden" 
                        accept=".pdf,.doc,.docx,.txt"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50"
                    >
                        {isUploading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <UploadCloud size={20} />
                        )}
                        {isUploading ? "Uploading..." : "Upload Files"}
                    </button>
                    {uploadStatus && (
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${uploadStatus.success ? 'text-emerald-600' : 'text-red-600'}`}>
                            {uploadStatus.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {uploadStatus.message}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <FileText size={20} className="text-blue-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Document Library</h2>
                    </div>
                    <DocumentComponent numberOfDocuments={20} />
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Database size={20} className="text-emerald-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Financial Ledger</h2>
                    </div>
                    <FinancialRecords numberOfRecords={20} />
                </section>
            </div>
        </div>
    )
}

export default DataDocuments
