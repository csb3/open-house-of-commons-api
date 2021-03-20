const https = require('https');
const xml2js = require('xml2js');
const concat = require('concat-stream');

const cheerio = require('cheerio');
const axios = require('axios');
const { listenerCount } = require('cluster');

// Helper function to fetch XML files.
const getXMLfile = function(url) {
  const parser = new xml2js.Parser();
  parser.on('error', err => console.log('Parser error', err));
  
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      response.on('error', err => console.log('Error while reading', err));
    
      response.pipe(concat(buffer => {
        let string = buffer.toString();
        
        parser.parseString(string, (err, result) => {
          resolve(result);
        });
      }));
    });
  });
};

// Helper function for web scraping
async function fetchHTML(url) {
  const { data } = await axios.get(url)
  return cheerio.load(data)
}

async function webscrape(vote_num) {
  const $ = await fetchHTML(`https://www.ourcommons.ca/members/en/votes/43/2/${vote_num}`);

  const sponsorNum = $("a.ce-mip-mp-tile")["0"].attribs.href.replace(/\D/g,'');
  //console.log(sponsorNum);

  const sittingNum = $("div.mip-vote-title-section").text().replace(/\s+/g,' ').trim().split(" ")[9];
  //console.log(sittingNum);

  let billLink;
  if ($("div.ce-mip-vote-block").children('p').eq(3).length) {
    billLink = $("div.ce-mip-vote-block").children('p').eq(3).children('a').eq(1)["0"].attribs.href;
    //console.log(billLink);
  } else {
    billLink = "";
  }

  return {
    sponsorNum: sponsorNum,
    sittingNum: sittingNum,
    billUrl: billLink
  }
}

module.exports = {
  getXMLfile,
  webscrape
};