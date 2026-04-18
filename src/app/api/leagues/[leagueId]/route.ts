import { NextResponse } from 'next/server';
import { leaguesService } from '@/features/Leagues/server/leagues.service';
import { connectDb } from '@/shared/server/connect-db';
import { handleOptions, withCors } from '@/shared/server/cors';

type RouteContext = {
  params: Promise<{ leagueId: string }>;
};

function isObjectId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value);
}

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function GET(request: Request, context: RouteContext) {
  try {
    await connectDb();
    const { leagueId } = await context.params;

    const league = isObjectId(leagueId)
      ? await leaguesService.getLeagueById(leagueId)
      : await leaguesService.getLeagueByExternalId(leagueId);

    if (!league) {
      return withCors(
        request,
        NextResponse.json(
          { success: false, message: 'League not found' },
          { status: 404 },
        ),
      );
    }

    return withCors(
      request,
      NextResponse.json({ success: true, data: league }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch league';
    return withCors(
      request,
      NextResponse.json({ success: false, message }, { status: 500 }),
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await connectDb();
    const { leagueId } = await context.params;

    const existingLeague = isObjectId(leagueId)
      ? await leaguesService.getLeagueById(leagueId)
      : await leaguesService.getLeagueByExternalId(leagueId);

    if (!existingLeague) {
      return withCors(
        request,
        NextResponse.json(
          { success: false, message: 'League not found' },
          { status: 404 },
        ),
      );
    }

    const deletedLeague = await leaguesService.deleteLeagueById(
      existingLeague._id,
    );

    return withCors(
      request,
      NextResponse.json({ success: true, data: deletedLeague }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete league';
    return withCors(
      request,
      NextResponse.json({ success: false, message }, { status: 500 }),
    );
  }
}
