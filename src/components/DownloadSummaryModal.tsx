import React, { useState } from 'react';
import { ChatMessage, EducationLevel, GlossaryTerm } from '../types';
import { 
  extractLinkedGlossaryTerms, 
  generateMarkdownSummary, 
  downloadFile, 
  generatePdfSummary 
} from '../utils/studySummaryExport';
import { 
  FileDown, 
  FileText, 
  X, 
  Check, 
  Copy, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Download,
  Printer,
  FileCode
} from 'lucide-react';

interface DownloadSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  educationLevel: EducationLevel;
}

export const DownloadSummaryModal: React.FC<DownloadSummaryModalProps> = ({
  isOpen,
  onClose,
  messages,
  educationLevel,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  if (!isOpen) return null;

  const userQuestions = messages.filter((m) => m.role === 'user');
  const linkedTerms = extractLinkedGlossaryTerms(messages);

  const levelLabels: Record<EducationLevel, string> = {
    school: 'High School & AP Biology',
    undergrad: 'College & Pre-Med Tier',
    grad: 'Graduate & Medical School Tier',
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownSummary(messages, educationLevel, linkedTerms);
    const firstQ = userQuestions[0];
    const slug = firstQ
      ? firstQ.content
          .slice(0, 24)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      : 'lesson';
    const fileName = `BioStudy-Summary-${slug}-${new Date().toISOString().slice(0, 10)}.md`;
    downloadFile(md, fileName, 'text/markdown;charset=utf-8');
  };

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      generatePdfSummary(messages, educationLevel, linkedTerms);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownSummary(messages, educationLevel, linkedTerms);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <FileDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Download Study Summary</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Offline Notes
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Export your lesson Q&A transcript and linked medical glossary index
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Study Session Snapshot */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Academic Tier:</span>
            <span className="font-semibold text-emerald-400">{levelLabels[educationLevel]}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Questions Answered:</span>
            <span className="font-semibold text-slate-200">{userQuestions.length} questions</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Chat Messages:</span>
            <span className="font-semibold text-slate-200">{messages.length} messages</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Detected Glossary Terms:</span>
            <span className="font-bold text-teal-400">{linkedTerms.length} terms</span>
          </div>

          {/* Linked terms pill list */}
          {linkedTerms.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60">
              <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Linked Glossary Appendix included in export:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {linkedTerms.map((term) => (
                  <span
                    key={term.id}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 font-medium"
                  >
                    {term.term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Options Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Choose Export Format:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* PDF Option */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700/80 hover:border-emerald-500/60 text-left transition group shadow-md flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Recommended
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition flex items-center gap-1.5">
                  <span>Structured PDF Document</span>
                  <Download className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Paginated document with cover block, Q&A breakdown, and high-yield glossary appendix.
                </p>
              </div>
            </button>

            {/* Markdown Option */}
            <button
              onClick={handleDownloadMarkdown}
              className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700/80 hover:border-teal-500/60 text-left transition group shadow-md flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
                  <FileCode className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Notion / Obsidian
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-teal-300 transition flex items-center gap-1.5">
                  <span>Markdown File (.md)</span>
                  <Download className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Standard markdown formatted notes ready to import into your personal knowledge base.
                </p>
              </div>
            </button>
          </div>

          {/* Quick Copy to Clipboard */}
          <div className="pt-2">
            <button
              onClick={handleCopyMarkdown}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Copied Full Markdown Summary to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Markdown Summary to Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-1 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-500">
            Study offline anywhere • All mechanisms, definitions, and board pearls preserved
          </p>
        </div>
      </div>
    </div>
  );
};
