import fs from 'fs';

async function updateTable() {
  //  TheSportsDB open community endpoint - League 4330 = Scottish Premiership
  const url = 'https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4330&s=2026-2027';

  try {
    const res = await fetch(url);
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    
    const data = await res.json();
    
    if (!data.table) {
        console.log("No table data found. API Response:", JSON.stringify(data));
        process.exit(1);
    }

    // Mapping TheSportsDB schema to perfectly match the Framer React component
    const formattedStandings = data.table.map(item => ({
      rank: parseInt(item.intRank),
      name: item.strTeam,
      logo: item.strTeamBadge,
      played: parseInt(item.intPlayed),
      won: parseInt(item.intWin),
      drawn: parseInt(item.intDraw),
      lost: parseInt(item.intLoss),
      gd: parseInt(item.intGoalDifference),
      points: parseInt(item.intPoints),
      form: item.strForm || ""
    }));

    fs.writeFileSync('standings.json', JSON.stringify(formattedStandings, null, 2));
    console.log(`Saved standings.json with ${formattedStandings.length} teams.`);
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(1);
  }
}

updateTable();
