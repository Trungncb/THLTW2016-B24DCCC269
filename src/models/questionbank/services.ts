import { KnowledgeBlock, Subject, Question, ExamStructure, Exam, QuestionFilter } from './types';

// Khóa lưu trữ
const STORAGE_KEYS = {
  KNOWLEDGE_BLOCKS: 'qb_knowledge_blocks',
  SUBJECTS: 'qb_subjects',
  QUESTIONS: 'qb_questions',
  EXAM_STRUCTURES: 'qb_exam_structures',
  EXAMS: 'qb_exams',
};

// ============ KHỐI KIẾN THỨC ============
export const KnowledgeBlockService = {
  getAll: (): KnowledgeBlock[] => {
    const data = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BLOCKS);
    return data ? JSON.parse(data) : [];
  },
  
  add: (block: Omit<KnowledgeBlock, 'id' | 'createdAt'>): KnowledgeBlock => {
    const blocks = KnowledgeBlockService.getAll();
    const newBlock: KnowledgeBlock = {
      ...block,
      id: `kb_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    blocks.push(newBlock);
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BLOCKS, JSON.stringify(blocks));
    return newBlock;
  },

  delete: (id: string): void => {
    const blocks = KnowledgeBlockService.getAll().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BLOCKS, JSON.stringify(blocks));
  },

  update: (id: string, updates: Partial<KnowledgeBlock>): void => {
    const blocks = KnowledgeBlockService.getAll();
    const idx = blocks.findIndex(b => b.id === id);
    if (idx !== -1) {
      blocks[idx] = { ...blocks[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BLOCKS, JSON.stringify(blocks));
    }
  },
};

// ============ MÔN HỌC ============
export const SubjectService = {
  getAll: (): Subject[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return data ? JSON.parse(data) : [];
  },

  add: (subject: Omit<Subject, 'id' | 'createdAt'>): Subject => {
    const subjects = SubjectService.getAll();
    const newSubject: Subject = {
      ...subject,
      id: `subj_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    subjects.push(newSubject);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    return newSubject;
  },

  delete: (id: string): void => {
    const subjects = SubjectService.getAll().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  update: (id: string, updates: Partial<Subject>): void => {
    const subjects = SubjectService.getAll();
    const idx = subjects.findIndex(s => s.id === id);
    if (idx !== -1) {
      subjects[idx] = { ...subjects[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    }
  },

  getById: (id: string): Subject | undefined => {
    return SubjectService.getAll().find(s => s.id === id);
  },
};

// ============ CÂU HỎI ============
export const QuestionService = {
  getAll: (): Question[] => {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return data ? JSON.parse(data) : [];
  },

  add: (question: Omit<Question, 'id' | 'createdAt'>): Question => {
    const questions = QuestionService.getAll();
    const newQuestion: Question = {
      ...question,
      id: `q_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    questions.push(newQuestion);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    return newQuestion;
  },

  delete: (id: string): void => {
    const questions = QuestionService.getAll().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  update: (id: string, updates: Partial<Question>): void => {
    const questions = QuestionService.getAll();
    const idx = questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      questions[idx] = { ...questions[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    }
  },

  search: (filters: QuestionFilter): Question[] => {
    let questions = QuestionService.getAll();
    
    if (filters.subjectId) {
      questions = questions.filter(q => q.subjectId === filters.subjectId);
    }
    if (filters.difficulty) {
      questions = questions.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.knowledgeBlockId) {
      questions = questions.filter(q => q.knowledgeBlockId === filters.knowledgeBlockId);
    }
    
    return questions;
  },

  getBySubject: (subjectId: string): Question[] => {
    return QuestionService.getAll().filter(q => q.subjectId === subjectId);
  },
};

// ============ CẤU TRÚC ĐỀ THI ============
export const ExamStructureService = {
  getAll: (): ExamStructure[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXAM_STRUCTURES);
    return data ? JSON.parse(data) : [];
  },

  add: (structure: Omit<ExamStructure, 'id' | 'createdAt'>): ExamStructure => {
    const structures = ExamStructureService.getAll();
    const newStructure: ExamStructure = {
      ...structure,
      id: `es_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    structures.push(newStructure);
    localStorage.setItem(STORAGE_KEYS.EXAM_STRUCTURES, JSON.stringify(structures));
    return newStructure;
  },

  delete: (id: string): void => {
    const structures = ExamStructureService.getAll().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXAM_STRUCTURES, JSON.stringify(structures));
  },

  getBySubject: (subjectId: string): ExamStructure[] => {
    return ExamStructureService.getAll().filter(s => s.subjectId === subjectId);
  },
};

// ============ ĐỀ THI ============
export const ExamService = {
  getAll: (): Exam[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
    return data ? JSON.parse(data) : [];
  },

  add: (exam: Omit<Exam, 'id' | 'createdAt'>): Exam => {
    const exams = ExamService.getAll();
    const newExam: Exam = {
      ...exam,
      id: `exam_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    exams.push(newExam);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    return newExam;
  },

  delete: (id: string): void => {
    const exams = ExamService.getAll().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  },

  createFromStructure: (structureId: string): { exam: Exam | null; error: string | null } => {
    const structure = ExamStructureService.getAll().find(s => s.id === structureId);
    if (!structure) {
      return { exam: null, error: 'Cấu trúc đề thi không tồn tại' };
    }

    const allQuestions = QuestionService.getBySubject(structure.subjectId);
    const selectedQuestions: Question[] = [];

    for (const req of structure.requirements) {
      const filtered = allQuestions.filter(q => q.difficulty === req.difficulty);
      const categoryFiltered = req.knowledgeBlocks
        ? filtered.filter(q => req.knowledgeBlocks!.includes(q.knowledgeBlockId))
        : filtered;

      if (categoryFiltered.length < req.count) {
        return {
          exam: null,
          error: `Không đủ câu hỏi ${req.difficulty} (cần ${req.count}, có ${categoryFiltered.length})`,
        };
      }

      // Chọn ngẫu nhiên
      const shuffled = categoryFiltered.sort(() => Math.random() - 0.5);
      selectedQuestions.push(...shuffled.slice(0, req.count));
    }

    const newExam = ExamService.add({
      examStructureId: structureId,
      subjectId: structure.subjectId,
      questions: selectedQuestions,
    });

    return { exam: newExam, error: null };
  },
};
