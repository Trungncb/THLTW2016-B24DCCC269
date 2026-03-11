// Khối kiến thức
export interface KnowledgeBlock {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

// Môn học
export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  description?: string;
  createdAt?: string;
}

// Câu hỏi
export interface Question {
  id: string;
  code: string;
  subjectId: string;
  knowledgeBlockId: string;
  content: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  answer?: string;
  createdAt?: string;
}

// Cấu trúc đề thi
export interface ExamStructure {
  id: string;
  name: string;
  subjectId: string;
  requirements: {
    difficulty: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
    count: number;
    knowledgeBlocks?: string[]; // mảng id khối kiến thức
  }[];
  createdAt?: string;
}

// Đề thi
export interface Exam {
  id: string;
  examStructureId: string;
  subjectId: string;
  questions: Question[];
  createdAt?: string;
}

// Filter tìm kiếm
export interface QuestionFilter {
  subjectId?: string;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  knowledgeBlockId?: string;
}
