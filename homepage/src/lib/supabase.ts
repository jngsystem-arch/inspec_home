import { createClient } from '@supabase/supabase-js'

// 하드코딩된 환경변수 (Cloudflare Pages 빌드 에러 방지용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vkbcbptetaqtgpjldshk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_DqLGRJ90-i_ctzUueJN_Pw_kFuDBCFe";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
