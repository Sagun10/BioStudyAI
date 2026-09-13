import { jsPDF } from 'jspdf';
import { ChatMessage, EducationLevel, GlossaryTerm } from '../types';
import { BIOLOGY_GLOSSARY, getSortedGlossaryKeywords, findGlossaryTerm } from '../data/glossaryData';

/**
 * Extracts unique glossary terms that are referenced or discussed across the chat messages
 */
export function extractLinkedGlossaryTerms(messages: ChatMessage[]): GlossaryTerm[] {
  const combinedText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join(' ')
    .toLowerCase();

  const foundTermsMap = new Map<string, GlossaryTerm>();
  const keywords = getSortedGlossaryKeywords();

  for (const item of keywords) {
    const termLower = item.keyword.toLowerCase();
    // Search with word boundary or substring match
    if (combinedText.includes(termLower)) {
      const termObj = findGlossaryTerm(item.termId) || findGlossaryTerm(item.keyword);
      if (termObj && !foundTermsMap.has(termObj.id)) {
        foundTermsMap.set(termObj.id, termObj);
      }
    }
  }

  // Also check if any message explicitly mentions terms
  return Array.from(foundTermsMap.values());
}

/**
 * Generates structured Markdown study notes
 */
export function generateMarkdownSummary(
  messages: ChatMessage[],
  educationLevel: EducationLevel,
  glossaryTerms: GlossaryTerm[]
): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const levelLabels: Record<EducationLevel, string> = {
    school: 'High School & AP Biology',
    undergrad: 'College & Pre-Medical Sciences',
    grad: 'Graduate & Medical School (USMLE / Pathology)',
  };

  const userQuestions = messages.filter((m) => m.role === 'user');
  const mainTopic = userQuestions.length > 0 
    ? userQuestions[0].content.slice(0, 60).replace(/[^\w\s-]/g, '').trim()
    : 'Biology Study Session';

  let md = `# BioStudy AI — Comprehensive Study Summary\n\n`;
  md += `> **Topic**: ${mainTopic}\n`;
  md += `> **Date**: ${dateStr}\n`;
  md += `> **Academic Tier**: ${levelLabels[educationLevel]}\n`;
  md += `> **Total Questions Explored**: ${userQuestions.length}\n`;
  md += `> **Linked Medical & Biology Glossary Terms**: ${glossaryTerms.length}\n\n`;
  md += `---\n\n`;

  md += `## 📚 Lesson Transcript & Q&A Breakdown\n\n`;

  let qIndex = 1;
  messages.forEach((msg) => {
    if (msg.role === 'user') {
      md += `### ❓ Question ${qIndex++}: ${msg.content}\n\n`;
      if (msg.imageUrl) {
        md += `*(Diagram / Homework Image Attached to Question)*\n\n`;
      }
    } else {
      md += `#### 💡 BioStudy AI Explanation & Mechanism\n\n`;
      md += `${msg.content.trim()}\n\n`;
      md += `---\n\n`;
    }
  });

  if (glossaryTerms.length > 0) {
    md += `## 🧬 Linked Glossary & High-Yield Terms Index\n\n`;
    md += `Below are key definitions, physiological mechanisms, and clinical pearls discussed during this session:\n\n`;

    glossaryTerms.forEach((term) => {
      md += `### ${term.term} ${term.pronunciation ? `*(${term.pronunciation})*` : ''}\n`;
      md += `- **Category**: ${term.category} | **Tier**: ${term.level.toUpperCase()}\n`;
      if (term.etymology) {
        md += `- **Etymology**: ${term.etymology}\n`;
      }
      md += `- **Definition**: ${term.definition}\n`;
      if (term.mechanism) {
        md += `- **Physiological / Biochemical Mechanism**: ${term.mechanism}\n`;
      }
      if (term.clinicalPearl) {
        md += `- **⭐ High-Yield Clinical Pearl**: ${term.clinicalPearl}\n`;
      }
      if (term.relatedTerms && term.relatedTerms.length > 0) {
        md += `- **Related Concepts**: ${term.relatedTerms.join(', ')}\n`;
      }
      md += `\n`;
    });
  }

  md += `---\n`;
  md += `*Generated with BioStudy AI — Master Biology & Medicine with Step-by-Step Mechanisms & Visual 3D Models.*\n`;

  return md;
}

/**
 * Downloads a string as a file in the browser
 */
export function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a structured, multi-page PDF study summary
 */
export function generatePdfSummary(
  messages: ChatMessage[],
  educationLevel: EducationLevel,
  glossaryTerms: GlossaryTerm[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  const levelLabels: Record<EducationLevel, string> = {
    school: 'High School & AP Biology',
    undergrad: 'College & Pre-Medical Sciences',
    grad: 'Graduate & Medical School (USMLE)',
  };

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      currentY = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Top subtle running line
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('BioStudy AI — Offline Study Summary & Notes', margin, 10);
    doc.text(levelLabels[educationLevel], pageWidth - margin, 10, { align: 'right' });

    // Bottom page number
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const pageNum = doc.getNumberOfPages();
    doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  };

  // 1. Cover / Top Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, currentY, contentWidth, 34, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('BioStudy AI — Study Summary & Notes', margin + 6, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(167, 243, 208); // emerald-200
  doc.text(`Academic Tier: ${levelLabels[educationLevel]}`, margin + 6, currentY + 19);

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFontSize(8.5);
  const userQs = messages.filter((m) => m.role === 'user');
  doc.text(
    `Date: ${dateStr}   |   ${userQs.length} Questions Explored   |   ${glossaryTerms.length} Key Terms Linked`,
    margin + 6,
    currentY + 27
  );

  currentY += 40;

  // 2. Chat Q&A Transcript
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Lesson Transcript & Problem Solutions', margin, currentY);
  currentY += 6;

  let qNum = 1;

  for (const msg of messages) {
    if (msg.role === 'user') {
      checkPageBreak(20);

      // Question Box
      doc.setFillColor(241, 245, 249); // slate-100
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.4);

      const qTitle = `Q${qNum++}: ${msg.content}`;
      const splitQ = doc.splitTextToSize(qTitle, contentWidth - 10);
      const boxHeight = splitQ.length * 5 + 6;

      checkPageBreak(boxHeight + 5);
      doc.roundedRect(margin, currentY, contentWidth, boxHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(splitQ, margin + 5, currentY + 6);

      currentY += boxHeight + 4;
    } else {
      // AI Tutor Response
      checkPageBreak(25);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text('BioStudy AI Explanation & Biochemical Mechanisms:', margin, currentY);
      currentY += 5;

      // Clean markdown symbols for readable plain text in PDF
      const cleanContent = msg.content
        .replace(/### /g, '\n')
        .replace(/## /g, '\n')
        .replace(/# /g, '\n')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .trim();

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85); // slate-700

      const splitA = doc.splitTextToSize(cleanContent, contentWidth);
      
      // Print paragraph line by line with auto page break
      for (const line of splitA) {
        checkPageBreak(5);
        doc.text(line, margin, currentY);
        currentY += 4.5;
      }

      currentY += 4;
      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 6;
    }
  }

  // 3. Glossary Terms Section
  if (glossaryTerms.length > 0) {
    checkPageBreak(25);
    currentY += 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Linked Glossary & High-Yield Definitions Index', margin, currentY);
    currentY += 7;

    for (const term of glossaryTerms) {
      checkPageBreak(28);

      // Term Card
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(13, 148, 136); // teal-600
      const termTitle = `${term.term} ${term.pronunciation ? `[${term.pronunciation}]` : ''} - (${term.category})`;
      doc.text(termTitle, margin + 4, currentY + 5);

      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);

      const defLines = doc.splitTextToSize(`Definition: ${term.definition}`, contentWidth - 8);
      for (const line of defLines) {
        checkPageBreak(5);
        doc.text(line, margin + 4, currentY);
        currentY += 4;
      }

      if (term.mechanism) {
        const mechLines = doc.splitTextToSize(`Mechanism: ${term.mechanism}`, contentWidth - 8);
        for (const line of mechLines) {
          checkPageBreak(5);
          doc.text(line, margin + 4, currentY);
          currentY += 4;
        }
      }

      if (term.clinicalPearl) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 83, 9); // amber-700
        const pearlLines = doc.splitTextToSize(`Clinical Pearl: ${term.clinicalPearl}`, contentWidth - 8);
        for (const line of pearlLines) {
          checkPageBreak(5);
          doc.text(line, margin + 4, currentY);
          currentY += 4;
        }
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
      }

      currentY += 4;
    }
  }

  // Draw header/footer on page 1 as well
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Top subtle running line
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('BioStudy AI — Offline Study Summary & Notes', margin, 10);
    doc.text(levelLabels[educationLevel], pageWidth - margin, 10, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  // Generate clean filename
  const firstQ = messages.find((m) => m.role === 'user');
  const slug = firstQ
    ? firstQ.content
        .slice(0, 24)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : 'lesson';

  doc.save(`BioStudy-Summary-${slug}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
