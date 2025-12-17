export type UserRole = 'admin' | 'client';

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface AdminInvite {
  id: string;
  email: string;
  invited_by: string | null;
  accepted_at: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  company: string | null;
  invite_token: string | null;
  invite_sent_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface BrandKnowledge {
  id: string;
  client_id: string;
  title: string;
  content: string;
  created_by: string | null;
  updated_at: string;
  created_at: string;
}

// Updated to include new chat statuses
export type InterviewStatus = 
  | 'base_questions' 
  | 'analyzing' 
  | 'follow_up' 
  | 'synthesizing' 
  | 'completed'
  | 'chatting'
  | 'generating_profile';

export interface BaseAnswers {
  idealReader: string;
  writingSample: string;
  voiceWords: string;
  avoidWords: string;
  platforms: string;
}

export interface InterviewSession {
  id: string;
  client_id: string;
  status: InterviewStatus;
  base_answers: BaseAnswers | null;
  follow_up_questions: string[] | null;
  follow_up_answers: Record<string, string> | null;
  style_profile: string | null;
  title?: string | null;
  archived?: boolean;
  deleted_at?: string | null;
  last_message_at?: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface StyleProfile {
  id: string;
  client_id: string;
  session_id: string;
  core_voice: string | null;
  linkedin_rules: string | null;
  twitter_rules: string | null;
  email_rules: string | null;
  raw_profile: string;
  created_at: string;
}

export interface BaseQuestion {
  id: keyof BaseAnswers;
  question: string;
  placeholder: string;
  multiline: boolean;
}

export const BASE_QUESTIONS: BaseQuestion[] = [
  {
    id: 'idealReader',
    question: 'Who is your ideal reader, and how do you want them to feel after reading your content?',
    placeholder: 'Describe your target audience and the emotional impact you want to create...',
    multiline: true,
  },
  {
    id: 'writingSample',
    question: 'Paste a link to (or text from) a piece of content you\'re most proud of.',
    placeholder: 'Share your best work - this helps us understand your natural writing style...',
    multiline: true,
  },
  {
    id: 'voiceWords',
    question: 'What are 3 words you would use to describe your brand voice?',
    placeholder: 'e.g., Authoritative, Warm, Witty',
    multiline: false,
  },
  {
    id: 'avoidWords',
    question: 'What are 3 words you would NEVER use to describe your brand?',
    placeholder: 'e.g., Corporate, Boring, Salesy',
    multiline: false,
  },
  {
    id: 'platforms',
    question: 'Which platforms do you publish on?',
    placeholder: 'e.g., LinkedIn, Twitter/X, Email Newsletter, Medium',
    multiline: false,
  },
];

// ============================================
// Chat Message Types
// ============================================

export type ChatMessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  session_id: string;
  role: ChatMessageRole;
  content: string;
  created_at: string;
}

// For local state before saving to DB
export interface LocalChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  isStreaming?: boolean;
}

// ============================================
// Category of One Profile Types
// ============================================

export interface ContrarianPosition {
  their_belief: string;
  mainstream_belief: string;
}

export interface GapTheyFill {
  frustration: string;
  desired_outcome: string;
}

export interface UniqueMethodology {
  name: string;
  description: string;
  components: string[];
}

export interface Transformation {
  before: string;
  after: string;
}

export interface CategoryOfOneProfile {
  id: string;
  client_id: string;
  session_id: string;
  positioning_statement: string | null;
  unique_differentiation: string | null;
  contrarian_position: ContrarianPosition | null;
  gap_they_fill: GapTheyFill | null;
  unique_methodology: UniqueMethodology | null;
  transformation: Transformation | null;
  competitive_landscape: string | null;
  raw_profile: string;
  business_profile_md?: string | null;
  category_of_one_md?: string | null;
  created_at: string;
  updated_at: string;
}

// Structured profile for display and export
export interface CategoryOfOneProfileData {
  positioningStatement: string;
  uniqueDifferentiation: string;
  contrarianPosition: ContrarianPosition;
  gapTheyFill: GapTheyFill;
  uniqueMethodology: UniqueMethodology;
  transformation: Transformation;
  competitiveLandscape: string;
}

// ============================================
// LLM Config Types
// ============================================

export interface LLMConfig {
  id: string;
  name: string;
  model: string;
  chat_system_prompt: string;
  synthesis_system_prompt: string;
  updated_by: string | null;
  updated_at: string;
}

