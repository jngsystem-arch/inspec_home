import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const WEB3FORMS_KEY = "08ac26e2-da08-4bbd-8871-ca08b59572f0";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formType, payload } = body;

    // 1. Supabase에 데이터 저장
    const inquiryData = {
      name: payload.name || payload.from_name || '미상',
      phone: payload['연락처'] || '',
      company: payload['회사·건물명'] || payload['건물 상호(명칭)'] || '',
      inquiry_type: formType,
      details: JSON.stringify(payload),
      status: '신규'
    };

    const { error: dbError } = await supabase
      .from('inquiries')
      .insert([inquiryData]);

    if (dbError) {
      console.error('Supabase Insert Error:', dbError);
    }

    // 2. Web3Forms를 통한 이메일 발송
    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        ...payload
      }),
    });

    const web3Data = await web3Response.json();

    if (!web3Data.success) {
      return NextResponse.json({ success: false, error: 'Mail sending failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Contact Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
