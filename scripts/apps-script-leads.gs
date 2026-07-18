/**
 * Google Sheet backup for Shoot In Panama lead submissions.
 *
 * SETUP (client, ~3 min — no DNS needed):
 *  1. Create a Google Sheet (e.g. "Shoot In Panama — Leads").
 *  2. Extensions → Apps Script. Delete the sample, paste THIS file, Save.
 *  3. Deploy → New deployment → type "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Deploy, authorize, and COPY the Web app URL (ends in /exec).
 *  4. Send that /exec URL to the developer. It's set as a secret:
 *       npx wrangler pages secret put SHEET_ENDPOINT --project-name shootinpanama-verite
 *       npx wrangler pages deploy --branch main
 *  After that, every website submission appends a row here (alongside KV + email).
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var d = {};
    try { d = JSON.parse(e.postData.contents); } catch (err) { d = e.parameter || {}; }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp','Kind','Name','Email','Company','Type','Crew','Dates','Guide','Language','Brief','IP']);
      sheet.getRange('1:1').setFontWeight('bold');
    }
    sheet.appendRow([
      d.ts || new Date().toISOString(), d.kind || '', d.name || '', d.email || '',
      d.company || '', d.type || '', d.crew || '', d.dates || '', d.guide || '',
      d.lang || '', d.brief || '', d.ip || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Shoot In Panama leads endpoint — POST only.');
}
