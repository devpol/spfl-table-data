import fs from 'fs';

async function updateTable() {
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    console.error('Error: FOOTBALL_API_KEY is not defined.');
    process.exit(1);
  }

  // League 179 = Scottish Premiership, Season = current year (e.g., 2026)
  const currentYear = new Date().getFullYear();
  const url = `https://v3.football.api-sports.io/standings?league=179&season=${currentYear}`;

  try {
    const res = await fetch(url, {
      headers: { 'x-apisports-key': apiKey }
    });

    const data = await res.json();
    const rawStandings = data?.response?.[0]?.league?.standings?.[0] || [];

    // Format into a clean, lightweight array
    const formattedStandings = rawStandings.map(item => ({
      rank: item.rank,
      team: item.team.name,
      logo: item.team.logo,
      played: item.all.played,
      won: item.all.win,
      drawn: item.all.draw,
      lost: item.all.lose,
      gd: item.goalsDiff,
      points: item.points,
      form: item.form
    }));

    fs.writeFileSync('standings.json', JSON.stringify(formattedStandings, null, 2));
    console.log('Successfully updated standings.json');
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(1);
  }
}

updateTable();
