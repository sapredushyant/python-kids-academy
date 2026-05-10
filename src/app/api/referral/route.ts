import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key so we can update any row (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REFERRAL_BONUS = 250;

export async function POST(req: NextRequest) {
  const { inviterUserId, refereeUserId } = await req.json();

  if (!inviterUserId || !refereeUserId) {
    return NextResponse.json({ error: 'Missing user IDs.' }, { status: 400 });
  }

  if (inviterUserId === refereeUserId) {
    return NextResponse.json({ error: 'Cannot refer yourself.' }, { status: 400 });
  }

  // Record the referral — UNIQUE(referee_id) prevents double-awarding
  const { error: insertErr } = await supabaseAdmin
    .from('referrals')
    .insert({ inviter_id: inviterUserId, referee_id: refereeUserId });

  if (insertErr) {
    // Duplicate = already rewarded
    if (insertErr.code === '23505') {
      return NextResponse.json({ alreadyRewarded: true });
    }
    console.error('Referral insert error:', insertErr);
    return NextResponse.json({ error: 'Failed to record referral.' }, { status: 500 });
  }

  // Award XP to inviter in leaderboard (upsert adds bonus to existing row)
  await supabaseAdmin.rpc('add_xp_to_user', {
    p_user_id: inviterUserId,
    p_xp: REFERRAL_BONUS,
  }).then(({ error }) => {
    if (error) console.error('Failed to award inviter XP:', error);
  });

  // Return bonus so the client can add it locally for the referee
  return NextResponse.json({ success: true, bonus: REFERRAL_BONUS });
}
