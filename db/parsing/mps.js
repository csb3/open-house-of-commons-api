const { db } = require('./../index');

// Before start fetching mps.xml, get all PersonId(unique mp ID).
const getMpIds = async function() {
  const queryString = 'SELECT mp_id FROM mp_votes GROUP BY mp_id;';
  try {
    return await db.query(queryString);

  } catch (err) {
    console.log(err);
  }
};

// To reference their constituencies.
const getConstituency = async function(constituencyId) {
  const queryString = 'SELECT id FROM constituencies WHERE name=$1;';

  try {
    return await db.query(queryString, [constituencyId]);

  } catch (err) {
    console.log(err);
  }
};

// This function is to seed an MP.
const seedOneMp = async function(parsedXML, id) {
  const queryString = 'INSERT INTO mps (id, first_name, last_name, party_name, constituency_id) VALUES ($1, $2, $3, $4, $5)';
  const mp = parsedXML.Profile.MemberOfParliamentRole[0];
  
  try {
    // Get constituency id for referencing in db.
    await getConstituency(mp.ConstituencyName[0])
      .then(res => {
        const queryParams = [
          id,
          mp.PersonOfficialFirstName[0],
          mp.PersonOfficialLastName[0],
          mp.CaucusShortName[0],
          res.rows[0].id
        ];
        
        db.query(queryString, queryParams);
      });
  } catch (error) {
    console.log(error, 'NAY');
  }
};

// Loop through the unique mp ID from DB and fetch individual mp data
const seedMpsTable = async function(XMLparser) {
  // Get all mp's unique ID before start fetching xml files
  const allTheMps = await getMpIds();

  for await (const mpId of allTheMps.rows) {
    const url = `https://www.ourcommons.ca/members/en/${mpId.mp_id}/xml`;

    XMLparser(url, seedOneMp, mpId.mp_id);
  }
};

module.exports = {
  seedMpsTable,
};