import fs from 'fs';

async function updateTable() {
  // ESPN's undocumented free tier for the Scottish Premiership (sco.1)
  const url = 'https://site.api.espn.com/apis/v2/sports/soccer/sco.1/standings';

  try {
    const res = await fetch(url);
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    
    const data = await res.json();
    
    // ESPN nests the actual table array deeply inside their response
    const entries = data?.children?.[0]?.standings?.entries;

    if (!entries) {
        console.log("Error: ESPN data structure has changed or is unavailable.");
        process.exit(1);
    }

    // Helper function to extract specific metrics from ESPN's stats array
    const getStat = (statsArray, statName) => {
        const stat = statsArray.find(s => s.name === statName);
        return stat ? parseInt(stat.value) : 0;
    };

    // Map the ESPN schema to perfectly match your Framer React component
    const formattedStandings = entries.map((item, index) => {
      // ESPN sometimes labels goal difference differently, so we check both
      const gd = getStat(item.stats, 'pointDifferential') || getStat(item.stats, 'goalDifference');
      
      return {
        rank: index + 1,
        name: item.team.name,
        logo: item.team.logos?.[0]?.href || "", 
        played: getStat(item.stats, 'gamesPlayed'),
        won: getStat(item.stats, 'wins'),
        drawn: getStat(item.stats, 'ties'),
        lost: getStat(item.stats, 'losses'),
        gd: gd,
        points: getStat(item.stats, 'points'),
        form: "" 
      };
    });

    fs.writeFileSync('standings.json', JSON.stringify(formattedStandings, null, 2));
    console.log(`Saved standings.json with ${formattedStandings.length} teams.`);
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(1);
  }
}

updateTable();
