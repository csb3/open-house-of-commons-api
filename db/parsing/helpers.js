const https = require('https');
const xml2js = require('xml2js');
const concat = require('concat-stream');

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

module.exports = {
  getXMLfile,
};