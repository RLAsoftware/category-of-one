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
  message_count: number;
  flagged_for_review: boolean;
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

export interface PositioningStatement {
  who: string;
  what: string;
  how: string;
  full_statement: string;
}

export interface Megatrend {
  name: string;
  description: string;
}

export interface Confluence {
  megatrends: Megatrend[];
  named_phenomenon: string | null;
  why_now_summary: string;
}

export interface ContrarianApproach {
  conventional_frustration: string;
  where_they_break_convention: string;
  contrarian_beliefs: string[];
  mind_share_word: string | null;
}

export interface AllRoadsStory {
  mercenary_story: string;
  missionary_story: string;
  critical_combo: string[];
}

export interface DetailedTransformation {
  before: {
    frustrations: string[];
    failed_alternatives: string[];
  };
  after: {
    outcomes: string[];
    what_becomes_possible: string;
  };
  client_example: string | null;
}

export interface ProofPoints {
  client_results: string[];
  testimonials: string[];
  credentials: string[];
  media_and_publications: string[];
  awards_and_recognition: string[];
  experience_metrics: string | null;
}

export interface UniqueMethodology {
  name: string | null;
  steps_or_components: string[];
  what_makes_it_distinctive: string | null;
}

export interface VoiceAndLanguage {
  distinctive_phrases: string[];
  tone_notes: string | null;
}

export interface CategoryOfOneProfile {
  id: string;
  client_id: string;
  session_id: string;
  client_name: string | null;
  business_name: string | null;
  positioning_statement: PositioningStatement | null;
  unique_differentiation: string | null;
  confluence: Confluence | null;
  contrarian_approach: ContrarianApproach | null;
  all_roads_story: AllRoadsStory | null;
  transformation: DetailedTransformation | null;
  proof_points: ProofPoints | null;
  unique_methodology: UniqueMethodology | null;
  voice_and_language: VoiceAndLanguage | null;
  competitive_landscape: string | null;
  raw_profile: string | null;
  business_profile_md: string | null;
  category_of_one_md: string | null;
  synthesis_attempts: number;
  synthesis_error: string | null;
  needs_review: boolean;
  created_at: string;
  updated_at: string;
}

// Legacy types for backward compatibility (deprecated)
/** @deprecated Use PositioningStatement instead */
export interface ContrarianPosition {
  their_belief: string;
  mainstream_belief: string;
}

/** @deprecated Use DetailedTransformation instead */
export interface Transformation {
  before: string;
  after: string;
}

/** @deprecated No longer used in new schema */
export interface GapTheyFill {
  frustration: string;
  desired_outcome: string;
}

// Structured profile for display and export
export interface CategoryOfOneProfileData {
  positioningStatement: PositioningStatement;
  uniqueDifferentiation: string;
  confluence: Confluence;
  contrarianApproach: ContrarianApproach;
  allRoadsStory: AllRoadsStory;
  transformation: DetailedTransformation;
  proofPoints: ProofPoints;
  uniqueMethodology: UniqueMethodology;
  voiceAndLanguage: VoiceAndLanguage;
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

