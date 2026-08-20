import fs from 'fs';

async function updateTable() {
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    console.error('Error: FOOTBALL_API_KEY secret is missing or empty.');
    process.exit(1);
  }

  // Using 2025 season for test verification
  const url = 'https://v3.football.api-sports.io/standings?league=179&season=2025';

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey.trim()
      }
    });

    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log('Full API Response:', JSON.stringify(data, null, 2));

    const rawStandings = data?.response?.[0]?.league?.standings?.[0] || [];

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
    console.log(`Saved standings.json with ${formattedStandings.length} teams.`);
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(1);
  }
}

updateTable();
