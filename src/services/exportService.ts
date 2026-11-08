import type {
  Problem,
  SolutionApproach,
  LearningNote,
  RevisionItem,
  ContestResult,
} from "@/types";

export interface BackupData {
  version?: string;
  exported_at?: string;
  problems: Problem[];
  approaches?: SolutionApproach[];
  learningNotes?: LearningNote[];
  revisionItems?: RevisionItem[];
  contestResults?: ContestResult[];
}

export function serializeBackupJson(data: BackupData): string {
  const payload = {
    version: "1.0.0",
    exported_at: new Date().toISOString(),
    problems: data.problems || [],
    approaches: data.approaches || [],
    learningNotes: data.learningNotes || [],
    revisionItems: data.revisionItems || [],
    contestResults: data.contestResults || [],
  };
  return JSON.stringify(payload, null, 2);
}

export function validateBackupJson(rawJson: string): {
  isValid: boolean;
  problemCount?: number;
  error?: string;
  parsedData?: BackupData;
} {
  try {
    const data = JSON.parse(rawJson);
    if (!data || typeof data !== "object") {
      return { isValid: false, error: "Root JSON must be an object." };
    }
    if (!Array.isArray(data.problems)) {
      return { isValid: false, error: "Missing 'problems' array in backup." };
    }
    return {
      isValid: true,
      problemCount: data.problems.length,
      parsedData: data,
    };
  } catch (err: any) {
    return { isValid: false, error: err.message || "Invalid JSON syntax." };
  }
}

export function generateProblemsCsv(problems: Problem[]): string {
  const header = "title,platform,difficulty,topic,status,confidence,time_spent,url\n";
  const rows = problems.map((p) => {
    const cleanTitle = `"${p.title.replace(/"/g, '""')}"`;
    return `${cleanTitle},${p.platform},${p.difficulty},"${p.primary_topic || ""}",${p.status},${p.confidence_rating},${p.time_spent_minutes || 0},"${p.url}"`;
  });
  return header + rows.join("\n");
}
