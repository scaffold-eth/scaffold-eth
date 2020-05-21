const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { ethers, Contract } = require('ethers');

//FIRST YOU NEED TO SETUP GOOGLE SHEETS PERMISSIONS:
//https://developers.google.com/sheets/api/quickstart/nodejs

const SPREADSHEET_ID = '1Yh2k5DY66b2tct01EVAV-6jgSFFJtv5CEEtnxr_la_0'

const OUTPUT_FILE = "../react-app/src/validVotes.json";
const ERC20_ABI = [{"constant": true,"inputs": [{"name": "_owner","type": "address"}],"name": "balanceOf","outputs": [{"name": "balance","type": "uint256"}],"payable": false,"type": "function"}]
const ERC20_TOKEN_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"
const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
const tokenContract = new Contract(ERC20_TOKEN_ADDRESS, ERC20_ABI,mainnetProvider);


// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), (auth)=>{
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'A1:D50000',
    }, async (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      let rows = res.data.values;
      //console.log("DEBUG SHEET INPUT:",rows)
      let titles = rows.shift()
      let balances = {}
      let validVotes = {}
      if (rows.length) {
        for(let r in rows) {




          let row = rows[r]
          //console.log(`-------- Checking Vote: ${row[0]}, ${row[1]}`);
          let signature = row[3];
          let timestamp = row[2];
          let emoji = row[1]
          let reconstructedMessage = "emojivote"+translateEmoji(emoji)+timestamp;
          //console.log("reconstructedMessage",reconstructedMessage)
          let recovered = await ethers.utils.verifyMessage ( reconstructedMessage , signature )
          //console.log("recovered",recovered)

          if(recovered===row[0]){
            console.log("✅ Valid Signature 🔏 for account "+recovered+" voting for "+emoji)

            let validAddress = recovered

            let balance
            if(typeof balances[validAddress] != "undefined"){
              balance = balances[validAddress]
            }else{
              balance = await tokenContract.balanceOf(validAddress);
            }

            console.log("💰 Balance of "+validAddress+" is "+ethers.utils.formatEther(balance) );

            let thisVote = {
              address: validAddress,
              vote: emoji,
              balance: balance,
              timestamp: timestamp
            }

            if(typeof validVotes[validAddress] == "undefined" || thisVote.timestamp >= validVotes[validAddress].timestamp){
              validVotes[validAddress] = thisVote
            }

          }

        }

        console.log("🗑  Cleaning out votes with no tokens");
        for(let v in validVotes){
          if(validVotes[v].balance.isZero()){
            delete validVotes[v]
          }
        }

        console.log("💾 Saving Votes...");

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(validVotes,null,2))
        console.log("🗃  File Written: "+OUTPUT_FILE);


      } else {
        console.log('No data found.');
      }
    });
  });
});


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const GOOGLE_TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(GOOGLE_TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(GOOGLE_TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', GOOGLE_TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

const translateEmoji = (emoji)=>{
  if(emoji==="🦁"){
    return "LION"
  } else if(emoji==="🐮"){
    return "COW"
  } else if(emoji==="🐭"){
    return "MOUSE"
  } else if(emoji==="🦊"){
    return "FOX"
  } else if(emoji==="🐶"){
    return "DOG"
  } else if(emoji==="🐰"){
    return "RABBIT"
  } else if(emoji==="🐸"){
    return "FROG"
  }
}
